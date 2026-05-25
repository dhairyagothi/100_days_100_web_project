const express = require("express");

const {
  getHealthStatus,
  getServerInfo,
  getUsers
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
| Mock Users Route
|--------------------------------------------------------------------------
*/

router.get("/users", getUsers);

module.exports = router;
