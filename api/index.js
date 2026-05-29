require('dotenv').config();

const connectDB = require('../server/db');
const app = require('../server/app');

let dbReady = false;

module.exports = async (req, res) => {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
  return app(req, res);
};
