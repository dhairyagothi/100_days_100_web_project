const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/foodController");

// Require a server-side admin key for write operations
function requireAdminKey(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || req.get("x-admin-key") !== adminKey) {
    return res.status(401).json({ message: "Unauthorized: admin key required" });
  }
  next();
}

//ejs
router.get("/view", ctrl.renderFoods);

router.get("/view/:id", ctrl.getFoodById);

router.post("/", requireAdminKey, ctrl.createFood);
router.get("/", ctrl.getFoods);
router.put("/:id", requireAdminKey, ctrl.updateFood);
router.delete("/:id", requireAdminKey, ctrl.deleteFood);


module.exports = router;