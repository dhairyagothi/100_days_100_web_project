// utils/tokenUtils.js
// Centralised helpers for token generation and secure cookie management.

const jwt = require("jsonwebtoken");

// ── Access Token ─────────────────────────────────────────────────────────────
// Short-lived (15 min). Sent as a Bearer token in Authorization header.
// Contains enough info to avoid DB lookups on every request.

const generateAccessToken = (user, familyId) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      familyId, // Ties this access token to a specific refresh token family
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
// Long-lived (7 days). Stored ONLY in an httpOnly cookie.
// Contains minimal payload — its job is just to identify the token family.

const generateRefreshToken = (userId, familyId) => {
  return jwt.sign(
    {
      userId,
      familyId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

// ── Secure Cookie Setter ──────────────────────────────────────────────────────
// httpOnly    → JS cannot read this cookie (XSS protection)
// secure      → Only sent over HTTPS in production
// sameSite    → Strict prevents CSRF attacks
// path        → Cookie only sent to /api/auth/* routes (reduces attack surface)

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth", // Scoped to auth routes only
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS) || 7 * 24 * 60 * 60 * 1000,
  });
};

// ── Cookie Clearer ────────────────────────────────────────────────────────────
const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
  });
};

// ── Get remaining TTL of a JWT (in seconds) ───────────────────────────────────
// Used to set the Redis blacklist TTL so entries auto-expire when the
// access token would have expired anyway (saves Redis memory).

const getTokenRemainingTTL = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded?.exp) return 0;
    const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);
    return Math.max(0, remainingSeconds);
  } catch {
    return 0;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getTokenRemainingTTL,
};