const sendResponse = require("../utils/responseHandler");

const users = [
  { id: 1, name: "John Doe",     email: "john@example.com",  role: "Admin",     status: "active"   },
  { id: 2, name: "Jane Smith",   email: "jane@example.com",  role: "Developer", status: "active"   },
  { id: 3, name: "Alex Johnson", email: "alex@example.com",  role: "Designer",  status: "inactive" },
  { id: 4, name: "Priya Sharma", email: "priya@example.com", role: "Developer", status: "active"   },
  { id: 5, name: "Raj Patel",    email: "raj@example.com",   role: "Manager",   status: "active"   }
];

/*
|--------------------------------------------------------------------------
| Health Controller
|--------------------------------------------------------------------------
*/
exports.getHealthStatus = (req, res) => {
  sendResponse(res, 200, true, "Server health status fetched successfully", {
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
};

/*
|--------------------------------------------------------------------------
| Server Info Controller
|--------------------------------------------------------------------------
*/
exports.getServerInfo = (req, res) => {
  sendResponse(res, 200, true, "Server information fetched successfully", {
    project:     process.env.APP_NAME      || "Express Server",
    framework:   process.env.APP_FRAMEWORK || "Express.js",
    version:     process.env.APP_VERSION   || "1.0.0",
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    port:        process.env.PORT
  });
};

/*
|--------------------------------------------------------------------------
| Users Controllers
|--------------------------------------------------------------------------
*/
exports.getUsers = (req, res) => {
  sendResponse(res, 200, true, "Users fetched successfully", {
    total: users.length,
    users
  });
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return sendResponse(res, 404, false, `User with id ${req.params.id} not found`, null);
  }
  sendResponse(res, 200, true, "User fetched successfully", user);
};

/*
|--------------------------------------------------------------------------
| 404 Catch-All Controller
|--------------------------------------------------------------------------
*/
exports.notFound = (req, res) => {
  sendResponse(res, 404, false, `Route ${req.originalUrl} not found`, null);
};