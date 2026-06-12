// models/Restaurant.js

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    cuisines: [
      {
        type: String,
        required: true
      }
    ],

    location: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    priceForTwo: {
      type: Number,
      required: true
    },

    diningRating: {
      type: Number,
      min: 0,
      max: 5
    },

    deliveryRating: {
      type: Number,
      min: 0,
      max: 5
    },

    distance: {
      type: String
    },

    images: [
      {
        type: String,
        required: true
      }
    ]
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);