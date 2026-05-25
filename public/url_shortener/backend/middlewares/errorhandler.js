class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const sendError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    statusCode,
    message,
    msg: message,
  };

  if (err.details) {
    response.errors = err.details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(new AppError('Invalid JSON payload', 400), res);
  }

  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.keys(err.errors).map((field) => ({
      field,
      message: err.errors[field].message,
    }));
    return sendError(new AppError('Validation failed', 400, details), res);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || err.keyPattern || {})[0] || 'field';
    return sendError(new AppError(`${field} already exists`, 409), res);
  }

  if (err.name === 'CastError') {
    return sendError(new AppError('Invalid resource identifier', 400), res);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(new AppError('Invalid or expired token', 401), res);
  }

  if (!err.isOperational) {
    console.error('Unhandled API error:', {
      method: req.method,
      path: req.originalUrl,
      message: err.message,
      stack: err.stack,
    });

    const message = process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message;

    return sendError(new AppError(message, err.statusCode || 500), res);
  }

  return sendError(err, res);
};

module.exports = {
  AppError,
  catchAsync,
  errorHandler,
};
