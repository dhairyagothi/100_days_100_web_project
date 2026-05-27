const mongoose = require('mongoose');

let connectionPromise = null;

function connectDB() {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    connectionPromise = Promise.reject(new Error('MONGODB_URI is not set'));
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(uri).then(() => mongoose.connection);
  return connectionPromise;
}

module.exports = connectDB;
