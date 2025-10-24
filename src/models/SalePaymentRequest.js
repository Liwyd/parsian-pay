/**
 * Sale Payment Request Model
 * Represents a payment request to Parsian Bank
 */
export class SalePaymentRequest {
  constructor(data = {}) {
    this.pin = data.pin || '';
    this.amount = data.amount || 0;
    this.orderId = data.orderId || '';
    this.callbackUrl = data.callbackUrl || '';
    this.additionalData = data.additionalData || '';
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
   * Get the amount
   * @returns {number|string}
   */
  getAmount() {
    return this.amount;
  }

  /**
   * Set the amount
   * @param {number|string} amount
   */
  setAmount(amount) {
    this.amount = amount;
  }

  /**
   * Get the order ID
   * @returns {number|string}
   */
  getOrderId() {
    return this.orderId;
  }

  /**
   * Set the order ID
   * @param {number|string} orderId
   */
  setOrderId(orderId) {
    this.orderId = orderId;
  }

  /**
   * Get the callback URL
   * @returns {string}
   */
  getCallbackUrl() {
    return this.callbackUrl;
  }

  /**
   * Set the callback URL
   * @param {string} callbackUrl
   */
  setCallbackUrl(callbackUrl) {
    this.callbackUrl = callbackUrl;
  }

  /**
   * Get additional data
   * @returns {string}
   */
  getAdditionalData() {
    return this.additionalData;
  }

  /**
   * Set additional data
   * @param {string} additionalData
   */
  setAdditionalData(additionalData) {
    this.additionalData = additionalData;
  }

  /**
   * Convert to object
   * @returns {Object}
   */
  toObject() {
    return {
      pin: this.pin,
      amount: this.amount,
      orderId: this.orderId,
      callbackUrl: this.callbackUrl,
      additionalData: this.additionalData
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

    if (!this.amount || this.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!this.orderId || this.orderId.toString().trim() === '') {
      errors.push('Order ID is required');
    }

    if (!this.callbackUrl || this.callbackUrl.trim() === '') {
      errors.push('Callback URL is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
