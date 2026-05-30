const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};

module.exports = errorMiddleware;
