import winston from 'winston';
import fs from 'fs';
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
      const logFileName = process.env.LOG_FILE || 'parsian-pay.log';
      logFile = path.join(__dirname, '..', '..', 'logs', logFileName);
    }

    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const transports = [
      new winston.transports.File({ 
        filename: logFile,
        maxsize: 5242880,
        maxFiles: 5
      })
    ];

    if (process.env.NODE_ENV !== 'production') {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      );
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'parsian-pay' },
      transports
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

}
