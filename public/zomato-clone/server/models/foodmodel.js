const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

// 👇 MOST IMPORTANT LINE
module.exports = mongoose.model("Food", foodSchema);