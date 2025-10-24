/**
 * Utility functions for Parsian Payment Gateway
 */

/**
 * Get value from object with case insensitive key
 * @param {Object} obj - Object to search
 * @param {string} key - Key to find
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Value or default
 */
export function getValue(obj, key, defaultValue = null) {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }

  const lowerKey = key.toLowerCase();
  for (const objKey in obj) {
    if (obj.hasOwnProperty(objKey) && objKey.toLowerCase() === lowerKey) {
      return obj[objKey];
    }
  }
  return defaultValue;
}

/**
 * Convert object keys to lowercase
 * @param {Object} obj - Object to convert
 * @returns {Object} Object with lowercase keys
 */
export function objectKeysToLower(obj) {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key.toLowerCase()] = obj[key];
    }
  }
  return result;
}

/**
 * Generate unique order ID
 * @returns {string} Unique order ID
 */
export function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate amount
 * @param {number|string} amount - Amount to validate
 * @returns {boolean} True if valid amount
 */
export function isValidAmount(amount) {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0;
}

/**
 * Format amount for Parsian API
 * @param {number|string} amount - Amount to format
 * @returns {number} Formatted amount
 */
export function formatAmount(amount) {
  const numAmount = parseFloat(amount);
  return Math.round(numAmount);
}

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Create request message for logging
 * @param {Object} request - Request object
 * @param {string} type - Request type
 * @returns {string} Formatted log message
 */
export function createRequestMessage(request, type) {
  const timestamp = new Date().toISOString();
  let message = `${timestamp} >> ${type} Request >> `;

  if (request.amount !== undefined) {
    message += `Amount: ${request.amount} >> `;
  }
  if (request.orderId !== undefined) {
    message += `OrderId: ${request.orderId} >> `;
  }
  if (request.callbackUrl !== undefined) {
    message += `CallbackUrl: ${request.callbackUrl} >> `;
  }
  if (request.token !== undefined) {
    message += `Token: ${request.token} >> `;
  }
  if (request.status !== undefined) {
    message += `Status: ${request.status} >> `;
  }
  if (request.rrn !== undefined) {
    message += `RRN: ${request.rrn} >> `;
  }

  return message;
}

/**
 * Create result message for logging
 * @param {Object} result - Result object
 * @param {string} type - Result type
 * @returns {string} Formatted log message
 */
export function createResultMessage(result, type) {
  const timestamp = new Date().toISOString();
  let message = `${timestamp} >> ${type} Result >> `;

  if (result.token !== undefined) {
    message += `Token: ${result.token} >> `;
  }
  if (result.status !== undefined) {
    message += `Status: ${result.status} >> `;
  }
  if (result.message !== undefined) {
    message += `Message: ${result.message} >> `;
  }
  if (result.rrn !== undefined) {
    message += `RRN: ${result.rrn} >> `;
  }
  if (result.cardNumberMasked !== undefined) {
    message += `CardNumberMasked: ${result.cardNumberMasked} >> `;
  }

  return message;
}
