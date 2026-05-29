const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'auth_token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
const isProduction = process.env.NODE_ENV === 'production';

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      name: user.name || user.username,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  COOKIE_NAME,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  verifyToken,
};
