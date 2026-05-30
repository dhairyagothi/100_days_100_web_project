const express = require("express");
const router  = express.Router();
const Job     = require("../models/Job");
const { protect, requireRole } = require("../middleware/auth");

// GET /api/jobs  — All open jobs (public)
router.get("/", async (req, res) => {
  try {
    const { search, type, location } = req.query;
    const filter = { isOpen: true };
    if (search)   filter.$or = [{ title: new RegExp(search, "i") }, { description: new RegExp(search, "i") }, { techStack: new RegExp(search, "i") }];
    if (type)     filter.type = type;
    if (location) filter.location = new RegExp(location, "i");
    const jobs = await Job.find(filter)
      .populate("employer", "name company")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/jobs/my  — Employer's own jobs
router.get("/my", protect, requireRole("employer"), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .populate("applicants", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/jobs/:id  — Single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name company");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/jobs  — Create job (employer only)
router.post("/", protect, requireRole("employer"), async (req, res) => {
  const { title, location, type, salary, description, techStack } = req.body;
  if (!title || !location || !description)
    return res.status(400).json({ message: "title, location and description are required" });
  try {
    const job = await Job.create({
      title, company: req.user.company || req.user.name,
      location, type, salary, description,
      techStack: techStack || [],
      employer: req.user._id,
    });
    const populated = await job.populate("employer", "name company");

    // 🔴 Emit real-time event — new job available to ALL connected clients
    req.app.get("io").emit("newJob", populated);

    res.status(201).json(populated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/jobs/:id  — Update job (owner only)
router.put("/:id", protect, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job listing" });
    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/jobs/:id  — Delete job (owner only)
router.delete("/:id", protect, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job listing" });
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
