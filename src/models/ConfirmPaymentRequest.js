/**
 * Confirm Payment Request Model
 * Represents a payment confirmation request
 */
export class ConfirmPaymentRequest {
  constructor(data = {}) {
    this.pin = data.pin || '';
    this.token = data.token || 0;
    this.status = data.status || 0;
    this.rrn = data.rrn || 0;
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
   * Get the RRN
   * @returns {number}
   */
  getRRN() {
    return this.rrn;
  }

  /**
   * Set the RRN
   * @param {number} rrn
   */
  setRRN(rrn) {
    this.rrn = rrn;
  }

  /**
   * Convert to object
   * @returns {Object}
   */
  toObject() {
    return {
      pin: this.pin,
      token: this.token,
      status: this.status,
      rrn: this.rrn
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

    if (this.status === undefined || this.status === null) {
      errors.push('Status is required');
    }

    if (!this.rrn || this.rrn <= 0) {
      errors.push('RRN must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
