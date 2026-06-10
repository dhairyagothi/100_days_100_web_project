const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Destination title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Spiritual', 'Heritage', 'Eco-Tourism', 'Adventure'],
        message: '{VALUE} is not a valid category',
      },
    },
    globalAppeal: {
      type: String,
      required: [true, 'Global appeal description is required'],
      maxlength: [300, 'Global appeal cannot exceed 300 characters'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    bestTimeToVisit: {
      type: String,
      default: 'October – March',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Destination', destinationSchema);