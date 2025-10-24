/**
 * Pay Result Model
 * Represents the result of a payment request
 */
export class PayResult {
  constructor(result = {}) {
    // Normalize the result object (case insensitive)
    const normalizedResult = this.normalizeObject(result);
    
    this.status = normalizedResult.status || 0;
    this.token = normalizedResult.token || null;
    this.message = normalizedResult.message || null;
  }

  /**
   * Normalize object keys to lowercase
   * @param {Object} obj
   * @returns {Object}
   */
  normalizeObject(obj) {
    const normalized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        normalized[key.toLowerCase()] = obj[key];
      }
    }
    return normalized;
  }

  /**
   * Get the status
   * @returns {number}
   */
  getStatus() {
    return this.status;
  }

  /**
   * Set the status
   * @param {number} status
   */
  setStatus(status) {
    this.status = status;
  }

  /**
   * Get the token
   * @returns {number|null}
   */
  getToken() {
    return this.token;
  }

  /**
   * Set the token
   * @param {number|null} token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get the message
   * @returns {string|null}
   */
  getMessage() {
    return this.message;
  }

  /**
   * Set the message
   * @param {string|null} message
   */
  setMessage(message) {
    this.message = message;
  }

  /**
   * Check if the payment was successful
   * @returns {boolean}
   */
  isSuccessful() {
    return this.status === 0 && this.token > 0;
  }

  /**
   * Convert to object
   * @returns {Object}
   */
  toObject() {
    return {
      status: this.status,
      token: this.token,
      message: this.message
    };
  }

  /**
   * Convert to JSON string
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify(this.toObject());
  }
}
