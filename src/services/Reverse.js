import { ParsianIPG } from './ParsianIPG.js';
import { ReversalRequest } from '../models/ReversalRequest.js';
import { ReversalResult } from '../models/ReversalResult.js';
import { ParsianErrorException } from '../utils/errors.js';

/**
 * Reverse service for handling payment reversals
 */
export class Reverse extends ParsianIPG {
  constructor(pin = '') {
    super(pin);
    this.reversalResult = null;
  }

  /**
   * Send reversal request to Parsian
   * @param {ReversalRequest} reversalRequest - Reversal request
   * @returns {Promise<Object>} Reversal result
   * @throws {ParsianErrorException}
   */
  async reverseRequest(reversalRequest) {
    if (reversalRequest.getToken() <= 0) {
      throw new ParsianErrorException(-2, 'Invalid token');
    }

    const parameters = {
      LoginAccount: reversalRequest.getPin(),
      Token: reversalRequest.getToken()
    };

    const result = await this.sendRequest(this.reverseUrl, 'ReversalRequest', parameters);

    const status = result.Status || -1;
    const token = result.Token || null;
    const message = result.Message || '';

    return {
      Status: status,
      Token: token,
      Message: message
    };
  }

  /**
   * Process payment reversal
   * @param {number} token - Payment token to reverse
   * @returns {Promise<ReversalResult|false>} Reversal result or false
   */
  async reverse(token) {
    const reversalRequest = new ReversalRequest({
      pin: this.pin,
      token: token
    });

    // Validate request
    const validation = reversalRequest.validate();
    if (!validation.isValid) {
      this.reversalResult = new ReversalResult({
        Status: -2,
        Token: token,
        Message: validation.errors.join(', ')
      });
      this.payLogger.writeError(this.getResultMessage(this.reversalResult.toObject()));
      return false;
    }

    this.payLogger.writeInfo(this.getRequestMessage(reversalRequest.toObject()));
    this.reversalResult = null;

    try {
      const result = await this.reverseRequest(reversalRequest);
      this.reversalResult = new ReversalResult(result);
      this.payLogger.writeInfo(this.getResultMessage(this.reversalResult.toObject()));
    } catch (error) {
      if (error instanceof ParsianErrorException) {
        this.reversalResult = new ReversalResult({
          Status: error.code,
          Token: token,
          Message: error.message
        });
      } else {
        this.reversalResult = new ReversalResult({
          Status: -1,
          Token: token,
          Message: error.message
        });
      }
      this.payLogger.writeError(this.getResultMessage(this.reversalResult.toObject()));
    }

    return this.reversalResult;
  }
}
