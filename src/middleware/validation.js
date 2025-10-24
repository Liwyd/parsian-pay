import Joi from 'joi';

/**
 * Validation middleware for payment requests
 */

// Payment creation validation schema
export const paymentCreateSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
  orderId: Joi.string().optional().allow(''),
  callbackUrl: Joi.string().uri().required().messages({
    'string.uri': 'Callback URL must be a valid URI',
    'any.required': 'Callback URL is required'
  }),
  additionalData: Joi.string().optional().allow('')
});

// Payment callback validation schema
export const paymentCallbackSchema = Joi.object({
  status: Joi.number().integer().required(),
  Token: Joi.number().integer().positive().required(),
  RRN: Joi.number().integer().positive().required()
});

// Payment reversal validation schema
export const paymentReverseSchema = Joi.object({
  token: Joi.number().integer().positive().required().messages({
    'number.positive': 'Token must be a positive number',
    'any.required': 'Token is required'
  })
});

/**
 * Validate request body against schema
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
}

/**
 * Validate request parameters
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
export function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.params = value;
    next();
  };
}
