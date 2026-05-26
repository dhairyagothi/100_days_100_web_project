const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      trim: true,
      default: 'Engineering & Development',
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary display string is required'],
    },
    salaryMin: {
      type: Number,
      required: [true, 'Minimum salary is required'],
    },
    salaryMax: {
      type: Number,
      required: [true, 'Maximum salary is required'],
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: ['full-time', 'part-time', 'internship', 'contract', 'temporary', 'fresher'],
        message: '{VALUE} is not a valid job type',
      },
    },
    shift: {
      type: String,
      required: [true, 'Shift is required'],
      enum: {
        values: ['day shift', 'night shift', 'flexible shift', 'fixed shift'],
        message: '{VALUE} is not a valid shift type',
      },
    },
    education: {
      type: String,
      required: [true, 'Education is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    requirements: {
      education: { type: String, default: '' },
      age: { type: String, default: '' },
      language: { type: String, default: '' },
      experience: { type: String, default: '' },
    },
    qualifications: {
      type: [String],
      default: [],
    },
    benefits: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    openings: {
      type: Number,
      default: 1,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Job', jobSchema);
