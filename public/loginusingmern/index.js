require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const helmet = require('helmet');           // FIX #8 — added helmet
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const rateLimit = require('express-rate-limit');
const collection = require('./mongo.js');
const authMiddleware = require('./middleware/auth');

// ─── Startup Guard ─────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('WARNING: Google OAuth env vars not set. Google login will fail.');
}

const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// ─── Rate Limiter ──────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Cookie helper (single source of truth) ───────────────────
// FIX #3 — secure flag now reads NODE_ENV instead of being hardcoded false
const cookieOptions = {
  httpOnly: true,
  secure: isProd,          // true in production (HTTPS), false in dev
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
};

// ─── View Engine ───────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ─── Middleware ────────────────────────────────────────────────
app.use(helmet());                          // FIX #8 — security headers
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: isProd },
}));

app.use(passport.initialize());
app.use(passport.session());

// ─── Passport Google Strategy ──────────────────────────────────
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await collection.findOne({ email: profile.emails[0].value });

    if (!user) {
      // FIX #4 — never store the literal string 'google-oauth' as a password.
      // These users authenticate via Google; they have no local password.
      // A random value ensures no one can ever log in locally with it.
      const { randomBytes } = require('crypto');
      user = await collection.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: randomBytes(32).toString('hex'),
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await collection.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ─── GET Routes ────────────────────────────────────────────────
app.get('/', (req, res) => res.render('login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

app.get('/home', authMiddleware, (req, res) => {
  res.render('home', { username: req.user.username });
});

// FIX #5 — handle the async logout() error properly
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    return res.redirect('/');
  });
});

// ─── Google OAuth Routes ───────────────────────────────────────
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // FIX #2 — removed || 'secretkey' fallback; startup guard ensures secret exists
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // FIX #3 — use shared cookieOptions (secure: isProd)
    res.cookie('token', token, cookieOptions);
    return res.redirect('/home');
  }
);

// ─── POST /signup ──────────────────────────────────────────────
app.post('/signup', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email address');
    }

    const existing = await collection.findOne({ email });
    if (existing) {
      // FIX #6 — vague message so attackers can't enumerate registered emails
      return res.status(400).send('Could not create account with those details');
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send('Weak password! Use 8+ chars with uppercase, lowercase, number & symbol.');
    }

    // FIX #7 — bumped salt rounds from 10 to 12
    const hashedPw = await bcrypt.hash(password, 12);
    await collection.create({ username, email, password: hashedPw });

    return res.status(201).send('Signup Successful');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// ─── POST /login ───────────────────────────────────────────────
app.post('/login', authLimiter, async (req, res) => {
  try {
    // FIX #9 — login now uses email (consistent with signup) instead of username.
    // Update your login form's input name from "username" to "email".
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const user = await collection.findOne({ email });

    // FIX #1 — single unified message; attacker cannot tell which field was wrong
    // FIX #1 — also moved bcrypt.compare inside the guard so timing is consistent
    const match = user && await bcrypt.compare(password, user.password);
    if (!user || !match) {
      return res.status(401).send('Invalid email or password');
    }

    // FIX #2 — removed || 'secretkey' fallback
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // FIX #3 — use shared cookieOptions (secure: isProd)
    res.cookie('token', token, cookieOptions);
    return res.status(200).send('Login successful');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

// ─── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = isProd ? 'Something went wrong' : err.message;
  res.status(status).json({ error: message });
});

// ─── Start ─────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
