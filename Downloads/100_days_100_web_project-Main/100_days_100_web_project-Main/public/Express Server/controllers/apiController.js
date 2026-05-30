const sendResponse = require("../utils/responseHandler");

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com"
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com"
  }
];

/*
|--------------------------------------------------------------------------
| Health Controller
|--------------------------------------------------------------------------
*/

exports.getHealthStatus = (req, res) => {
  sendResponse(
    res,
    200,
    true,
    "Server health status fetched successfully",
    {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  );
};

/*
|--------------------------------------------------------------------------
| Server Info Controller
|--------------------------------------------------------------------------
*/

exports.getServerInfo = (req, res) => {
  sendResponse(
    res,
    200,
    true,
    "Server information fetched successfully",
    {
      project: "Express Server",
      framework: "Express.js",
      version: "1.0.0",
      environment:
        process.env.NODE_ENV || "development"
    }
  );
};

/*
|--------------------------------------------------------------------------
| Users Controller
|--------------------------------------------------------------------------
*/

exports.getUsers = (req, res) => {
  sendResponse(
    res,
    200,
    true,
    "Users fetched successfully",
    users
  );
};
