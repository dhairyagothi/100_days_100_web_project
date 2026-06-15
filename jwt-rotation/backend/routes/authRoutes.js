// routes/authRoutes.js
//
// Routes:
//   POST /api/auth/register  → Create user
//   POST /api/auth/login     → Issue token family, set httpOnly cookie
//   POST /api/auth/refresh   → Rotate tokens (reuse detection lives here)
//   POST /api/auth/logout    → Invalidate family + blacklist access token
//   GET  /api/auth/me        → Get current user (protected)

const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const TokenFamily = require("../models/TokenFamily");
const { protect } = require("../middleware/authMiddleware");
const { getRedisClient } = require("../config/redis");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getTokenRemainingTTL,
} = require("../utils/tokenUtils");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already in use."
            : "Username already taken.",
      });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Registration failed." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Creates a brand-new token family for this session.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // .select("+password") because password has select:false in schema
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      // Generic message to prevent user enumeration
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated.",
      });
    }

    // ── Create a new token family ──────────────────────────────────────────
    const familyId = uuidv4();
    const accessToken = generateAccessToken(user, familyId);
    const refreshToken = generateRefreshToken(user._id, familyId);

    const refreshTokenExpiry = new Date(
      Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS) || 7 * 24 * 60 * 60 * 1000)
    );

    await TokenFamily.create({
      userId: user._id,
      familyId,
      currentToken: refreshToken,
      expiresAt: refreshTokenExpiry,
    });

    // Set refresh token in httpOnly cookie (NOT accessible to JS)
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        accessToken, // Frontend stores in memory (NOT localStorage)
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
//
// This is the heart of the security model.
//
// HAPPY PATH:
//   1. Read refresh token from httpOnly cookie
//   2. Verify JWT signature + expiry
//   3. Find matching token family in MongoDB
//   4. Confirm the token is the CURRENT one (not a used one)
//   5. Generate new access + refresh token pair
//   6. Push old refresh token to usedTokens[], update currentToken
//   7. Return new access token + set new refresh cookie
//
// REUSE DETECTED (token in usedTokens OR family inactive):
//   → Immediately deactivate the ENTIRE family
//   → Clear cookie
//   → Force re-login (401)
//   This handles the scenario where an attacker stole a refresh token and
//   uses it after the legitimate user already rotated.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found.",
      code: "NO_REFRESH_TOKEN",
    });
  }

  try {
    // ── Step 1: Verify JWT signature ───────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (jwtError) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token. Please log in again.",
        code: "REFRESH_TOKEN_INVALID",
      });
    }

    const { userId, familyId } = decoded;

    // ── Step 2: Find token family in MongoDB ───────────────────────────────
    const tokenFamily = await TokenFamily.findOne({ familyId });

    // ── Step 3: Reuse detection checks ────────────────────────────────────
    // Case A: Family doesn't exist (already wiped) or is inactive
    if (!tokenFamily || !tokenFamily.isActive) {
      clearRefreshTokenCookie(res);
      console.warn(`🚨 SECURITY: Inactive/missing family used. userId=${userId}, familyId=${familyId}`);
      return res.status(401).json({
        success: false,
        message: "Session invalidated. Please log in again.",
        code: "FAMILY_INVALIDATED",
      });
    }

    // Case B: Token exists in usedTokens → REUSE DETECTED
    if (tokenFamily.usedTokens.includes(incomingRefreshToken)) {
      console.warn(`🚨 SECURITY BREACH: Refresh token reuse detected!`);
      console.warn(`   userId=${userId}, familyId=${familyId}`);
      console.warn(`   Invalidating entire token family immediately.`);

      // Nuclear option: kill the entire family so attacker gets nothing
      await TokenFamily.updateOne(
        { familyId },
        { isActive: false }
      );

      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "Security alert: Token reuse detected. All sessions invalidated. Please log in again.",
        code: "TOKEN_REUSE_DETECTED",
      });
    }

    // Case C: Token doesn't match currentToken (tampered or from wrong family)
    if (tokenFamily.currentToken !== incomingRefreshToken) {
      // Same nuclear option
      await TokenFamily.updateOne({ familyId }, { isActive: false });
      clearRefreshTokenCookie(res);
      console.warn(`🚨 SECURITY: Token mismatch detected. userId=${userId}`);
      return res.status(401).json({
        success: false,
        message: "Token mismatch detected. Please log in again.",
        code: "TOKEN_MISMATCH",
      });
    }

    // ── Step 4: All checks passed — rotate tokens ──────────────────────────
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      await TokenFamily.updateOne({ familyId }, { isActive: false });
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "User account not found or deactivated.",
        code: "USER_NOT_FOUND",
      });
    }

    const newAccessToken = generateAccessToken(user, familyId);
    const newRefreshToken = generateRefreshToken(user._id, familyId);

    // Atomically: archive old token, set new current token
    await TokenFamily.updateOne(
      { familyId },
      {
        $push: { usedTokens: incomingRefreshToken }, // Archive old token
        $set: { currentToken: newRefreshToken },      // Set new token
      }
    );

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Tokens rotated successfully.",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    clearRefreshTokenCookie(res);
    return res.status(500).json({
      success: false,
      message: "Token refresh failed.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
//
// 1. Blacklist the current access token in Redis (until its natural expiry)
// 2. Deactivate the token family in MongoDB
// 3. Clear the httpOnly cookie
// ─────────────────────────────────────────────────────────────────────────────
router.post("/logout", protect, async (req, res) => {
  try {
    const { userId, familyId } = req.user;

    // ── Blacklist the current access token ────────────────────────────────
    // We store it in Redis with a TTL equal to its remaining validity period.
    // After that, it would be expired anyway, so Redis auto-cleans it.
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (accessToken) {
      try {
        const redis = getRedisClient();
        const ttl = getTokenRemainingTTL(accessToken);
        if (ttl > 0) {
          await redis.setex(`blacklist:${accessToken}`, ttl, "1");
        }
      } catch (redisError) {
        // Log but don't fail logout if Redis is unavailable
        console.error("⚠️  Failed to blacklist token in Redis:", redisError.message);
      }
    }

    // ── Deactivate the token family ────────────────────────────────────────
    await TokenFamily.updateOne({ familyId }, { isActive: false });

    // ── Clear cookie ───────────────────────────────────────────────────────
    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (Protected)
// Returns current user info from the verified JWT payload
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ success: false, message: "Failed to get user." });
  }
});

module.exports = router;