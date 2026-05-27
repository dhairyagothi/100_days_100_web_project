const { COOKIE_NAME, verifyToken } = require('../lib/tokens');

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

module.exports = { requireAuth };
