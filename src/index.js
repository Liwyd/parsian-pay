import app from './app.js';
import { PayLogger } from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new PayLogger();
const PORT = process.env.PORT || 3000;

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

logger.create();

if (!process.env.PARSIAN_PIN) {
  logger.writeError('PARSIAN_PIN environment variable is not set');
  process.exit(1);
}

const server = app.listen(PORT, () => {
  logger.writeInfo(`Server started on port ${PORT}`);
  logger.writeInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    logger.writeInfo(`Health check: http://localhost:${PORT}/health`);
  }
});

const gracefulShutdown = (signal) => {
  logger.writeInfo(`${signal} received, initiating graceful shutdown`);
  
  server.close(() => {
    logger.writeInfo('HTTP server closed');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.writeError('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.writeError(`Uncaught Exception: ${err.message}`);
  logger.writeError(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.writeError(`Unhandled Rejection at: ${promise}`);
  logger.writeError(`Reason: ${reason}`);
  process.exit(1);
});

export default server;
