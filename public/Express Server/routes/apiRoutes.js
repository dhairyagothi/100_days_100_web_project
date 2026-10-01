const express = require("express");
const {
  getHealthStatus,
  getServerInfo,
  getUsers,
  getUserById
} = require("../controllers/apiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/
router.get("/health", getHealthStatus);

/*
|--------------------------------------------------------------------------
| Server Information Route
|--------------------------------------------------------------------------
*/
router.get("/info", getServerInfo);

/*
|--------------------------------------------------------------------------
| Users Routes
|--------------------------------------------------------------------------
*/
router.get("/users",     authMiddleware, getUsers);
router.get("/users/:id", authMiddleware, getUserById);

module.exports = router;