/**
 * Confirm Result Model
 * Represents the result of a payment confirmation
 */
export class ConfirmResult {
  constructor(result = {}) {
    // Normalize the result object (case insensitive)
    const normalizedResult = this.normalizeObject(result);
    
    this.status = normalizedResult.status || 0;
    this.token = normalizedResult.token || null;
    this.message = normalizedResult.message || null;
    this.rrn = normalizedResult.rrn || null;
    this.cardNumberMasked = normalizedResult.cardnumbermasked || null;
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
   * Get the RRN
   * @returns {number|null}
   */
  getRRN() {
    return this.rrn;
  }

  /**
   * Set the RRN
   * @param {number|null} rrn
   */
  setRRN(rrn) {
    this.rrn = rrn;
  }

  /**
   * Get the masked card number
   * @returns {string|null}
   */
  getCardNumberMasked() {
    return this.cardNumberMasked;
  }

  /**
   * Set the masked card number
   * @param {string|null} cardNumberMasked
   */
  setCardNumberMasked(cardNumberMasked) {
    this.cardNumberMasked = cardNumberMasked;
  }

  /**
   * Check if the confirmation was successful
   * @returns {boolean}
   */
  isSuccessful() {
    return this.status === 0;
  }

  /**
   * Convert to object
   * @returns {Object}
   */
  toObject() {
    return {
      status: this.status,
      token: this.token,
      message: this.message,
      rrn: this.rrn,
      cardNumberMasked: this.cardNumberMasked
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
