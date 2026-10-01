const sendResponse = require('../utils/responseHandler');

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return sendResponse(res, 401, false, 'Invalid or missing API key', null);
  }

  if (!process.env.API_KEY) {
    return sendResponse(res, 500, false, 'Server not configured for authenticated access', null);
  }

  next();
};

module.exports = authMiddleware;