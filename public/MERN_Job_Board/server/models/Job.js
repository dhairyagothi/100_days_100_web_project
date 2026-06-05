const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    company:     { type: String, required: true, trim: true },
    location:    { type: String, required: true },
    type:        { type: String, enum: ["Full-time", "Part-time", "Remote", "Internship", "Contract"], default: "Full-time" },
    salary:      { type: String, default: "Not disclosed" },
    description: { type: String, required: true },
    techStack:   [{ type: String }],   // e.g. ["React", "Node.js", "MongoDB"]
    employer:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isOpen:      { type: Boolean, default: true },
    applicants:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
