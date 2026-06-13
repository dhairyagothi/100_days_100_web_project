const Food = require("../models/foodmodel");

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

//ejs
exports.renderFoods = async (req, res) => {
  try {
    const foods = await Food.find(); // DB se data lao
    res.render("restaurant", { foods }); // EJS ko data bhejo
  } catch (err) {
    res.status(500).send("Error loading page");
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).send("Restaurant not found");
    }

    res.render("restaurantDetail", { food });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
};