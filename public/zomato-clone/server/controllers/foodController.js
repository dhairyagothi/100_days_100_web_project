const Food = require("../models/foodModel");

exports.createFood = async (req, res) => {
  const data = await Food.create(req.body);
  res.json(data);
};

exports.getFoods = async (req, res) => {
  const data = await Food.find();
  res.json(data);
};

exports.updateFood = async (req, res) => {
  const data = await Food.findByIdAndUpdate(req.params.id, req.body);
  res.json(data);
};

exports.deleteFood = async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};