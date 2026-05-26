const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const verifyToken = require('../middleware/auth');

/**
 * GET /api/jobs
 * Query params: title, category, location, jobType, shift, education,
 *               salary ("min-max" or "min-Infinity"), datePosted (days), sortBy
 */
router.get('/', async (req, res) => {
  try {
    const { title, category, location, jobType, shift, education, salary, datePosted, sortBy } = req.query;

    const filter = { isActive: true };

    if (title) {
      filter.$or = [
        { title:   { $regex: title, $options: 'i' } },
        { company: { $regex: title, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (education) {
      filter.education = { $regex: education, $options: 'i' };
    }

    if (jobType) {
      filter.jobType = jobType.toLowerCase();
    }

    if (shift) {
      filter.shift = shift.toLowerCase();
    }

    // salary format from frontend: "50000-100000" or "500000-Infinity"
    if (salary) {
      const [minStr, maxStr] = salary.split('-');
      const sMin = parseFloat(minStr) || 0;
      const sMax = maxStr === 'Infinity' ? null : parseFloat(maxStr);
      filter.salaryMax = { $gte: sMin };
      if (sMax !== null) {
        filter.salaryMin = { $lte: sMax };
      }
    }

    if (datePosted) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(datePosted));
      filter.postedAt = { $gte: cutoff };
    }

    // sortBy values match what the frontend sends
    const sortMap = {
      salary_asc:  { salaryMin: 1 },
      salary_desc: { salaryMax: -1 },
      newest:      { postedAt: -1 },
      title_az:    { title: 1 },
    };
    const sort = sortMap[sortBy] || { postedAt: -1 };

    const jobs = await Job.find(filter).sort(sort);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ message: 'Server error while fetching jobs.' });
  }
});

/**
 * GET /api/jobs/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isActive: true });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error.message);
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Job not found.' });
    res.status(500).json({ message: 'Server error while fetching job.' });
  }
});

/**
 * POST /api/jobs — protected
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      title, category, company, location, salary, salaryMin, salaryMax,
      jobType, shift, education, skills, requirements, qualifications,
      benefits, description, openings, companyLogo,
    } = req.body;

    const errors = [];
    if (!title)       errors.push('Title is required');
    if (!category)    errors.push('Category is required');
    if (!company)     errors.push('Company is required');
    if (!location)    errors.push('Location is required');
    if (!salary)      errors.push('Salary is required');
    if (salaryMin == null) errors.push('salaryMin is required');
    if (salaryMax == null) errors.push('salaryMax is required');
    if (!jobType)     errors.push('Job type is required');
    if (!shift)       errors.push('Shift is required');
    if (!education)   errors.push('Education is required');
    if (!description) errors.push('Description is required');

    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const job = new Job({
      title, category, company, location, salary, salaryMin, salaryMax,
      jobType, shift, education,
      skills: skills || [],
      requirements: requirements || {},
      qualifications: qualifications || [],
      benefits: benefits || '',
      description,
      openings: openings || 1,
      companyLogo: companyLogo || '',
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
    res.status(500).json({ message: 'Server error while creating job.' });
  }
});

/**
 * PUT /api/jobs/:id — protected
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Job not found.' });
    res.status(500).json({ message: 'Server error while updating job.' });
  }
});

/**
 * DELETE /api/jobs/:id — soft delete, protected
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job:', error.message);
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Job not found.' });
    res.status(500).json({ message: 'Server error while deleting job.' });
  }
});

module.exports = router;
