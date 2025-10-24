import { ParsianIPG } from './ParsianIPG.js';
import { SalePaymentRequest } from '../models/SalePaymentRequest.js';
import { PayResult } from '../models/PayResult.js';
import { ParsianErrorException } from '../utils/errors.js';

/**
 * Payment service for handling payment requests
 */
export class Pay extends ParsianIPG {
  constructor(pin = '') {
    super(pin);
    this.payResult = null;
  }

  /**
   * Send payment request to Parsian
   * @param {SalePaymentRequest} salePaymentRequest - Payment request
   * @returns {Promise<Object>} Payment result
   * @throws {ParsianErrorException}
   */
  async sendPayRequest(salePaymentRequest) {
    const parameters = {
      LoginAccount: salePaymentRequest.getPin(),
      Amount: salePaymentRequest.getAmount(),
      OrderId: salePaymentRequest.getOrderId(),
      CallBackUrl: salePaymentRequest.getCallbackUrl(),
      AdditionalData: salePaymentRequest.getAdditionalData()
    };

    const result = await this.sendRequest(this.saleUrl, 'SalePaymentRequest', parameters);

    const token = result.Token || null;
    const status = result.Status || -1;
    const message = result.Message || '';

    return {
      Status: status,
      Token: token,
      Message: message
    };
  }

  /**
   * Process payment request
   * @param {number|string} orderId - Order ID
   * @param {number|string} amount - Payment amount
   * @param {string} callbackUrl - Callback URL
   * @param {string} additionalData - Additional data
   * @returns {Promise<PayResult>} Payment result
   */
  async payment(orderId, amount, callbackUrl, additionalData = '') {
    const salePaymentRequest = new SalePaymentRequest({
      pin: this.pin,
      amount: amount,
      orderId: orderId,
      callbackUrl: callbackUrl,
      additionalData: additionalData
    });

    // Validate request
    const validation = salePaymentRequest.validate();
    if (!validation.isValid) {
      this.payResult = new PayResult({
        Status: -2,
        Token: null,
        Message: validation.errors.join(', ')
      });
      this.payLogger.writeError(this.getResultMessage(this.payResult.toObject()));
      return this.payResult;
    }

    this.payLogger.writeInfo(this.getRequestMessage(salePaymentRequest.toObject()));
    this.payResult = null;

    try {
      const result = await this.sendPayRequest(salePaymentRequest);
      this.payResult = new PayResult(result);
      this.payLogger.writeInfo(this.getResultMessage(this.payResult.toObject()));
    } catch (error) {
      if (error instanceof ParsianErrorException) {
        this.payResult = new PayResult({
          Status: error.code,
          Token: null,
          Message: error.message
        });
      } else {
        this.payResult = new PayResult({
          Status: -1,
          Token: null,
          Message: error.message
        });
      }
      this.payLogger.writeError(this.getResultMessage(this.payResult.toObject()));
    }

    return this.payResult;
  }

  /**
   * Get redirect URL for payment gateway
   * @returns {string|null} Redirect URL or null
   */
  getRedirectUrl() {
    if (this.payResult && this.payResult.isSuccessful()) {
      const token = this.payResult.getToken();
      if (token && token > 0) {
        return `${this.gateUrl}${token}`;
      }
    }
    return null;
  }

  /**
   * Redirect to payment gateway (for server-side redirects)
   * @param {Object} res - Express response object
   * @returns {boolean} True if redirected, false otherwise
   */
  redirect(res) {
    const redirectUrl = this.getRedirectUrl();
    if (redirectUrl) {
      res.redirect(redirectUrl);
      return true;
    }
    return false;
  }
}
