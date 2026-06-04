require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const rateLimit = require('express-rate-limit');
const collection = require('./mongo.js');
const authMiddleware = require('./middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const port = process.env.PORT || 3000;

// ─── View Engine ───────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ─── Middleware ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false,
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
      user = await collection.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: 'google-oauth',
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

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.logout(() => {});
  return res.redirect('/');
});

// ─── Google OAuth Routes ───────────────────────────────────────
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

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

    const existing = await collection.findOne({ email });
    if (existing) {
      return res.status(400).send('Email already exists!');
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send('Weak password! Use 8+ chars with uppercase, lowercase, number & symbol.');
    }

    const hashedPw = await bcrypt.hash(password, 10);
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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    const user = await collection.findOne({ username });
    if (!user) {
      return res.status(400).send('User does not exist');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send('Incorrect password');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).send('Login successful');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

// ─── Start ─────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
