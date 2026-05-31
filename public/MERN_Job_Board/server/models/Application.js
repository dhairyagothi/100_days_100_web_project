const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    job:        { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter:{ type: String, required: true, maxlength: 2000 },
    status:     { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// One application per candidate per job
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
