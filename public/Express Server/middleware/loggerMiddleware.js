const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? "\x1b[31m"
        : res.statusCode >= 400
        ? "\x1b[33m"
        : res.statusCode >= 300
        ? "\x1b[36m"
        : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(
      `${statusColor}[${timestamp}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)${reset}`
    );
  });

  next();
};

module.exports = loggerMiddleware;