const express     = require("express");
const router      = express.Router();
const Application = require("../models/Application");
const Job         = require("../models/Job");
const { protect, requireRole } = require("../middleware/auth");

// POST /api/applications/:jobId  — Apply (candidate only)
router.post("/:jobId", protect, requireRole("candidate"), async (req, res) => {
  const { coverLetter } = req.body;
  if (!coverLetter) return res.status(400).json({ message: "Cover letter required" });
  try {
    const job = await Job.findById(req.params.jobId).populate("employer", "name");
    if (!job || !job.isOpen)
      return res.status(404).json({ message: "Job not found or closed" });

    const existing = await Application.findOne({ job: req.params.jobId, candidate: req.user._id });
    if (existing) return res.status(400).json({ message: "Already applied to this job" });

    const app = await Application.create({
      job: job._id,
      candidate: req.user._id,
      coverLetter,
    });

    // Add candidate to job's applicants list
    job.applicants.addToSet(req.user._id);
    await job.save();

    // 🔴 Real-time: Notify employer room that someone applied
    const io = req.app.get("io");
    io.to(`employer_${job.employer._id}`).emit("newApplication", {
      jobTitle:      job.title,
      candidateName: req.user.name,
      jobId:         job._id,
    });

    res.status(201).json({ message: "Application submitted!", application: app });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: "Already applied" });
    res.status(500).json({ message: e.message });
  }
});

// GET /api/applications/my  — Candidate: see own applications
router.get("/my", protect, requireRole("candidate"), async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/applications/job/:jobId  — Employer: see applications for a job
router.get("/job/:jobId", protect, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job" });
    const apps = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email bio")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/applications/:id/status  — Employer: update status
router.put("/:id/status", protect, requireRole("employer"), async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    app.status = req.body.status || app.status;
    await app.save();
    res.json(app);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
