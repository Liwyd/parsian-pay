import { PayResult } from './PayResult.js';

/**
 * Reversal Result Model
 * Represents the result of a payment reversal
 */
export class ReversalResult extends PayResult {
  constructor(result = {}) {
    super(result);
  }

  /**
   * Check if the reversal was successful
   * @returns {boolean}
   */
  isSuccessful() {
    return this.status === 0;
  }
}
