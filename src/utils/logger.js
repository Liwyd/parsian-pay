import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logger utility for Parsian Payment Gateway
 */
export class PayLogger {
  constructor() {
    this.logger = null;
  }

  /**
   * Create logger instance
   * @param {string} logFile - Log file path
   */
  create(logFile = '') {
    if (!logFile) {
      logFile = path.join(__dirname, '../logs/parsian-pay.log');
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'parsian-pay' },
      transports: [
        new winston.transports.File({ 
          filename: logFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  /**
   * Write info log
   * @param {string} message - Log message
   */
  writeInfo(message) {
    if (this.logger) {
      this.logger.info(message);
    }
  }

  /**
   * Write warning log
   * @param {string} message - Log message
   */
  writeWarning(message) {
    if (this.logger) {
      this.logger.warn(message);
    }
  }

  /**
   * Write error log
   * @param {string} message - Log message
   */
  writeError(message) {
    if (this.logger) {
      this.logger.error(message);
    }
  }

  /**
   * Write debug log
   * @param {string} message - Log message
   */
  writeDebug(message) {
    if (this.logger) {
      this.logger.debug(message);
    }
  }

  /**
   * Write notice log
   * @param {string} message - Log message
   */
  writeNotice(message) {
    if (this.logger) {
      this.logger.notice(message);
    }
  }

  /**
   * Write alert log
   * @param {string} message - Log message
   */
  writeAlert(message) {
    if (this.logger) {
      this.logger.alert(message);
    }
  }

  /**
   * Write critical log
   * @param {string} message - Log message
   */
  writeCritical(message) {
    if (this.logger) {
      this.logger.critical(message);
    }
  }

  /**
   * Write emergency log
   * @param {string} message - Log message
   */
  writeEmergency(message) {
    if (this.logger) {
      this.logger.emergency(message);
    }
  }
}
