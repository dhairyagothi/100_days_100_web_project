// middleware/authMiddleware.js
//
// Validates the access token on every protected request.
// Execution order:
//   1. Extract Bearer token from Authorization header
//   2. Check Redis blacklist (tokens invalidated via logout)
//   3. Verify JWT signature & expiry
//   4. Attach decoded user payload to req.user
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const { getRedisClient } = require("../config/redis");

const protect = async (req, res, next) => {
  try {
    // ── 1. Extract token ───────────────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
        code: "NO_TOKEN",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    // ── 2. Redis blacklist check ───────────────────────────────────────────
    // Tokens are blacklisted after logout so they can't be reused until
    // their natural expiry. This is O(1) and much faster than a DB lookup.
    try {
      const redis = getRedisClient();
      const isBlacklisted = await redis.get(`blacklist:${accessToken}`);

      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: "Token has been revoked. Please log in again.",
          code: "TOKEN_REVOKED",
        });
      }
    } catch (redisError) {
      // Redis being down should NOT block authentication.
      // Log the error and proceed (fail-open for availability).
      console.error("⚠️  Redis blacklist check failed:", redisError.message);
    }

    // ── 3. Verify JWT ──────────────────────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token expired.",
          code: "TOKEN_EXPIRED", // Frontend interceptor listens for this
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
        code: "TOKEN_INVALID",
      });
    }

    // ── 4. Attach user to request ──────────────────────────────────────────
    // decoded contains: { userId, username, email, familyId, iat, exp }
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
};

module.exports = { protect };