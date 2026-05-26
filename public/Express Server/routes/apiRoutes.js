const express = require("express");
const {
  getHealthStatus,
  getServerInfo,
  getUsers,
  getUserById
} = require("../controllers/apiController");

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
router.get("/users",     getUsers);
router.get("/users/:id", getUserById);

module.exports = router;