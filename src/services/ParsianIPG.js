import { ParsianRequest } from './ParsianRequest.js';
import { PayLogger } from '../utils/logger.js';
import { createRequestMessage, createResultMessage } from '../utils/helpers.js';

/**
 * Main Parsian IPG service class
 */
export class ParsianIPG extends ParsianRequest {
  constructor(pin = '') {
    super(pin);
    this.payLogger = new PayLogger();
  }

  /**
   * Create logger instance
   * @param {string} logFile - Log file path
   */
  createLogger(logFile = '') {
    this.payLogger.create(logFile);
  }

  /**
   * Get request message for logging
   * @param {Object} request - Request object
   * @returns {string} Formatted message
   */
  getRequestMessage(request) {
    if (request.amount !== undefined) {
      return createRequestMessage(request, 'SalePayment');
    } else if (request.token !== undefined && request.status !== undefined) {
      return createRequestMessage(request, 'ConfirmPayment');
    } else if (request.token !== undefined) {
      return createRequestMessage(request, 'Reversal');
    }
    return createRequestMessage(request, 'Unknown');
  }

  /**
   * Get result message for logging
   * @param {Object} result - Result object
   * @returns {string} Formatted message
   */
  getResultMessage(result) {
    if (result.cardNumberMasked !== undefined) {
      return createResultMessage(result, 'ConfirmPayment');
    } else if (result.token !== undefined && result.status !== undefined) {
      return createResultMessage(result, 'SalePayment');
    } else {
      return createResultMessage(result, 'Reversal');
    }
  }
}
