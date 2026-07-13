const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination is required'],
    },
    travelersCount: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler is required'],
      max: [50, 'Maximum 50 travelers per booking'],
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
      validate: {
        validator: function (val) {
          return val >= new Date();
        },
        message: 'Travel date must be in the future',
      },
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Cancelled'],
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);