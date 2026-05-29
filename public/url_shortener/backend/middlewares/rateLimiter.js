const rateLimit = require('express-rate-limit');

// 🔐 Signup limiter
const signupLimiter = rateLimit({
  windowMs: 120 * 1000, // 2 min
  max: 5,
  message: {
    success: false,
    msg: "Too many signup attempts, try later"
  }
});

// 🔐 Login limiter
const loginLimiter = rateLimit({
  windowMs: 300 * 1000,
  max: 5,
  message: {
    success: false,
    msg: "Too many login attempts, try later"
  }
});

// 🔗 Redirect limiter (IMPORTANT)
const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  msg: "Too many requests, slow down"
});

const verifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,              // strict
  message: {
    success: false,
    msg: "Too many attempts, try again later"
  }
});

module.exports = {
  signupLimiter,
  loginLimiter,
  redirectLimiter,
  verifyLimiter
};