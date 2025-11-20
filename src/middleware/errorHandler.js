/**
 * Error handling middleware for Express
 */

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
import { PayLogger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const logger = new PayLogger();
  logger.create();
  
  logger.writeError(`Error: ${err.message}`);
  if (err.stack) {
    logger.writeError(`Stack: ${err.stack}`);
  }

  let status = 500;
  let message = 'Internal server error';
  let errors = null;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    errors = err.details || [];
  } else if (err.name === 'ParsianErrorException') {
    status = 400;
    message = err.message;
  } else if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    status = 503;
    message = 'Service temporarily unavailable';
  } else if (err.status) {
    status = err.status;
    message = err.message;
  }

  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal server error';
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * 404 handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
}

/**
 * Async error wrapper
 * @param {Function} fn - Async function
 * @returns {Function} Express middleware
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
