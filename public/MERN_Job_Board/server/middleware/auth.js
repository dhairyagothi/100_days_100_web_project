const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  return res.status(401).json({ message: "No token provided" });
};

// Role check middleware factory
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: `Access denied. Requires role: ${roles.join(" or ")}` });
  next();
};

module.exports = { protect, requireRole };
