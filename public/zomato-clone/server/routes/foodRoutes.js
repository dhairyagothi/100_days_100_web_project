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
// Home
router.get("/", (req, res) => {
  res.render("index");
  
});

// EJS pages
router.get("/view", ctrl.renderFoods);
router.get("/view/:id", ctrl.getFoodById);

// API routes
router.get("/api/foods", ctrl.getFoods);
router.post("/api/foods", requireAdminKey, ctrl.createFood);
router.put("/api/foods/:id", requireAdminKey, ctrl.updateFood);
router.delete("/api/foods/:id", requireAdminKey, ctrl.deleteFood);


module.exports = router;