import { ParsianIPG } from './ParsianIPG.js';
import { ConfirmPaymentRequest } from '../models/ConfirmPaymentRequest.js';
import { ConfirmResult } from '../models/ConfirmResult.js';
import { ParsianErrorException, codeToMessage } from '../utils/errors.js';

/**
 * Callback service for handling payment confirmations
 */
export class Callback extends ParsianIPG {
  constructor(pin = '') {
    super(pin);
    this.confirmResult = null;
  }

  /**
   * Send confirmation request to Parsian
   * @param {ConfirmPaymentRequest} confirmPaymentRequest - Confirmation request
   * @returns {Promise<Object>} Confirmation result
   * @throws {ParsianErrorException}
   */
  async confirmRequest(confirmPaymentRequest) {
    const parameters = {
      LoginAccount: confirmPaymentRequest.getPin(),
      Token: confirmPaymentRequest.getToken()
    };

    const result = await this.sendRequest(this.confirmUrl, 'ConfirmPayment', parameters);

    return {
      Status: result.Status || -1,
      Token: result.Token || null,
      Message: result.Message || '',
      RRN: result.RRN || null,
      CardNumberMasked: result.CardNumberMasked || null
    };
  }

  /**
   * Process payment confirmation
   * @param {Object} postData - POST data from callback
   * @returns {Promise<ConfirmResult|false>} Confirmation result or false
   */
  async confirm(postData = {}) {
    const status = postData.status || postData.Status;
    const token = postData.Token || postData.token;
    const rrn = postData.RRN || postData.rrn;

    // Validate required parameters
    if (!status || !token || !rrn) {
      this.confirmResult = new ConfirmResult({
        Status: status || -2,
        Token: token || null,
        Message: codeToMessage(status || -2),
        RRN: rrn || null,
        CardNumberMasked: null
      });
      this.payLogger.writeError(this.getResultMessage(this.confirmResult.toObject()));
      return false;
    }

    // Check if status is 0 (success)
    if (parseInt(status) !== 0) {
      this.confirmResult = new ConfirmResult({
        Status: parseInt(status),
        Token: parseInt(token),
        Message: codeToMessage(parseInt(status)),
        RRN: parseInt(rrn),
        CardNumberMasked: null
      });
      this.payLogger.writeError(this.getResultMessage(this.confirmResult.toObject()));
      return false;
    }

    // Validate RRN
    if (parseInt(rrn) <= 0) {
      this.confirmResult = new ConfirmResult({
        Status: parseInt(status),
        Token: parseInt(token),
        Message: 'RRN is invalid',
        RRN: parseInt(rrn),
        CardNumberMasked: null
      });
      this.payLogger.writeError(this.getResultMessage(this.confirmResult.toObject()));
      return false;
    }

    // Validate token
    if (parseInt(token) <= 0) {
      this.confirmResult = new ConfirmResult({
        Status: parseInt(status),
        Token: parseInt(token),
        Message: 'Token is invalid',
        RRN: parseInt(rrn),
        CardNumberMasked: null
      });
      this.payLogger.writeError(this.getResultMessage(this.confirmResult.toObject()));
      return false;
    }

    const confirmPaymentRequest = new ConfirmPaymentRequest({
      pin: this.pin,
      token: parseInt(token),
      status: parseInt(status),
      rrn: parseInt(rrn)
    });

    this.payLogger.writeInfo(this.getRequestMessage(confirmPaymentRequest.toObject()));
    this.confirmResult = null;

    try {
      const result = await this.confirmRequest(confirmPaymentRequest);
      this.confirmResult = new ConfirmResult(result);
      this.payLogger.writeInfo(this.getResultMessage(this.confirmResult.toObject()));
    } catch (error) {
      if (error instanceof ParsianErrorException) {
        this.confirmResult = new ConfirmResult({
          Status: confirmPaymentRequest.getStatus(),
          Token: confirmPaymentRequest.getToken(),
          Message: error.message,
          RRN: confirmPaymentRequest.getRRN(),
          CardNumberMasked: null
        });
      } else {
        this.confirmResult = new ConfirmResult({
          Status: confirmPaymentRequest.getStatus(),
          Token: confirmPaymentRequest.getToken(),
          Message: error.message,
          RRN: confirmPaymentRequest.getRRN(),
          CardNumberMasked: null
        });
      }
      this.payLogger.writeError(this.getResultMessage(this.confirmResult.toObject()));
    }

    return this.confirmResult;
  }
}
