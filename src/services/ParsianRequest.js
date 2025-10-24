import soap from 'soap';
import { ParsianErrorException } from '../utils/errors.js';

/**
 * Base class for Parsian payment requests
 */
export class ParsianRequest {
  constructor(pin = '') {
    this.pin = pin;
    this.saleUrl = process.env.PARSIAN_SALE_URL || 'https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?wsdl';
    this.confirmUrl = process.env.PARSIAN_CONFIRM_URL || 'https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?wsdl';
    this.reverseUrl = process.env.PARSIAN_REVERSE_URL || 'https://pec.shaparak.ir/NewIPGServices/Reverse/ReversalService.asmx?wsdl';
    this.gateUrl = process.env.PARSIAN_GATE_URL || 'https://pec.shaparak.ir/NewIPG/?Token=';
    this.encoding = 'UTF-8';
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
   * Send SOAP request to Parsian service
   * @param {string} url - SOAP service URL
   * @param {string} method - SOAP method name
   * @param {Object} parameters - Request parameters
   * @returns {Promise<Object>} SOAP response
   * @throws {ParsianErrorException}
   */
  async sendRequest(url, method, parameters = {}) {
    try {
      const client = await soap.createClientAsync(url);
      
      // Set encoding
      client.setCharacterEncoding(this.encoding);
      
      const result = await client[method]({ requestData: parameters });
      
      if (result && result[`${method}Result`]) {
        return result[`${method}Result`];
      }
      
      throw new ParsianErrorException(-1, 'Invalid response from Parsian service');
    } catch (error) {
      if (error instanceof ParsianErrorException) {
        throw error;
      }
      
      // Handle SOAP errors
      if (error.message && error.message.includes('soap')) {
        throw new ParsianErrorException(-1, `SOAP Error: ${error.message}`);
      }
      
      throw new ParsianErrorException(-1, `Request failed: ${error.message}`);
    }
  }
}
