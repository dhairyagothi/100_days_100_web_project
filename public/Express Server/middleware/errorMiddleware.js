const errorMiddleware = (err, req, res, next) => {
  console.error("\x1b[31m[ERROR]\x1b[0m", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorMiddleware;