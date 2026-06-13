const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/foodController");

router.post("/", ctrl.createFood);
router.get("/", ctrl.getFoods);
router.put("/:id", ctrl.updateFood);
router.delete("/:id", ctrl.deleteFood);

//ejs
router.get("/view", ctrl.renderFoods);
module.exports = router;