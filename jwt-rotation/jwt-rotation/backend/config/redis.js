// config/redis.js
// Connects to Redis using ioredis. Used for:
//   - Blacklisting access tokens after logout
//   - Fast O(1) token validation in auth middleware

const Redis = require("ioredis");

let redisClient;

const connectRedis = () => {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    // Reconnect strategy: retry every 500ms up to 10 times
    retryStrategy: (times) => {
      if (times > 10) {
        console.error("❌ Redis: Max reconnect attempts reached.");
        return null; // Stop retrying
      }
      return Math.min(times * 500, 3000);
    },
    lazyConnect: true,
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected successfully");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });

  redisClient.on("reconnecting", () => {
    console.log("🔄 Redis reconnecting...");
  });

  return redisClient;
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };