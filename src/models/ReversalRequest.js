/**
 * Reversal Request Model
 * Represents a payment reversal request
 */
export class ReversalRequest {
  constructor(data = {}) {
    this.pin = data.pin || '';
    this.token = data.token || 0;
  }

  /**
   * Get the PIN
   * @returns {string}
   */
  getPin() {
    return this.pin;
  }

  /**
   * Set the PIN
   * @param {string} pin
   */
  setPin(pin) {
    this.pin = pin;
  }

  /**
   * Get the token
   * @returns {number}
   */
  getToken() {
    return this.token;
  }

  /**
   * Set the token
   * @param {number} token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Convert to object
   * @returns {Object}
   */
  toObject() {
    return {
      pin: this.pin,
      token: this.token
    };
  }

  /**
   * Validate the request
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.pin || this.pin.trim() === '') {
      errors.push('PIN is required');
    }

    if (!this.token || this.token <= 0) {
      errors.push('Token must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
