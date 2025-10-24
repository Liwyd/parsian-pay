import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { rateLimiter, paymentRateLimiter, helmetConfig, corsConfig, requestLogger } from './middleware/security.js';

import paymentRoutes from './routes/payment.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmetConfig);
app.use(cors(corsConfig));
app.use(rateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Parsian Payment Gateway is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.use('/api/v1/payment', paymentRateLimiter, paymentRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Parsian Payment Gateway API',
    version: process.env.npm_package_version || '1.0.0',
    endpoints: {
      health: '/health',
      payment: {
        create: 'POST /api/v1/payment/create',
        callback: 'POST /api/v1/payment/callback',
        reverse: 'POST /api/v1/payment/reverse',
        status: 'GET /api/v1/payment/status/:token'
      }
    }
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
