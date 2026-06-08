const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.redirect('/');

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();
  } catch (err) {
    return res.redirect('/');
  }
};

module.exports = authMiddleware;