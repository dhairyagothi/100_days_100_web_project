const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * POST /api/apply/:jobId
 * Submit a job application with an optional resume upload.
 * Accepts multipart/form-data with field name 'resume'.
 */
router.post('/apply/:jobId', upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, coverLetter } = req.body;

    // Validate required fields
    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required');
    if (!email || !email.trim()) errors.push('Email is required');
    if (!phone || !phone.trim()) errors.push('Phone is required');

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Check that the job exists and is active
    const job = await Job.findOne({ _id: jobId, isActive: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or no longer active.' });
    }

    // Build application object
    const applicationData = {
      jobId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      coverLetter: coverLetter ? coverLetter.trim() : '',
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : '',
    };

    const application = new Application(applicationData);
    const savedApplication = await application.save();

    res.status(201).json({
      message: 'Application submitted successfully.',
      application: savedApplication,
    });
  } catch (error) {
    console.error('Error submitting application:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid job ID.' });
    }
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 5MB limit.' });
    }
    res.status(500).json({ message: 'Server error while submitting application.' });
  }
});

/**
 * GET /api/applications
 * List all applications. Protected — requires admin JWT.
 * Optional query param: jobId — filter applications by job.
 */
router.get('/applications', verifyToken, async (req, res) => {
  try {
    const filter = {};

    if (req.query.jobId) {
      filter.jobId = req.query.jobId;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title company')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error.message);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
});

module.exports = router;
