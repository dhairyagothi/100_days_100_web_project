const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { protect } = require("../middleware/auth");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userResponse = (user) => ({
  _id:     user._id,
  name:    user.name,
  email:   user.email,
  role:    user.role,
  company: user.company,
  bio:     user.bio,
  token:   genToken(user._id),
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role, company, bio } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "name, email, password and role are required" });
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role, company: company || "", bio: bio || "" });
    res.status(201).json(userResponse(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password))
      return res.json(userResponse(user));
    res.status(401).json({ message: "Invalid credentials" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => res.json(userResponse(req.user)));

module.exports = router;
