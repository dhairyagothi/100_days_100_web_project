const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const passport = require('../lib/passport');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { signToken, setAuthCookie, clearAuthCookie } = require('../lib/tokens');

const router = express.Router();

const googleFailureUrl = '/public/Login.html?error=oauth_google';
const githubFailureUrl = '/public/Login.html?error=oauth_github';

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters with uppercase, lowercase, number, and symbol.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existing) {
      const field = existing.email === normalizedEmail ? 'email' : 'username';
      return res.status(400).json({
        message: field === 'email' ? 'Email already registered.' : 'Username already taken.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Sign up successful.',
      user: { username: user.username, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    if (!user.password) {
      return res.status(400).json({
        message: 'This account uses Google or GitHub sign-in. Please use one of those options.',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      message: 'Login successful.',
      user: { username: user.username, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({
    username: req.auth.username,
    email: req.auth.email,
    name: req.auth.name,
  });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out.' });
});

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect('/public/Login.html?error=oauth_google_disabled');
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: googleFailureUrl }),
  (req, res) => {
    const token = signToken(req.user);
    setAuthCookie(res, token);
    res.redirect('/index.html?auth=success');
  }
);

router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.redirect('/public/Login.html?error=oauth_github_disabled');
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: githubFailureUrl }),
  (req, res) => {
    const token = signToken(req.user);
    setAuthCookie(res, token);
    res.redirect('/index.html?auth=success');
  }
);

module.exports = router;
