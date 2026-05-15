const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_CONNECTION_URL;

async function database() {
  try {
    if (!connectionString) {
      throw new Error("MongoDB connection string missing in env");
    }

    await mongoose.connect(connectionString);

    console.log("Database Connected Successfully");

  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // 🔥 important (fail fast)
  }
}

module.exports = database;