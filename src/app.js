import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { rateLimiter, paymentRateLimiter, helmetConfig, corsConfig, requestLogger } from './middleware/security.js';

// Import routes
import paymentRoutes from './routes/payment.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(cors(corsConfig));
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Parsian Payment Gateway is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/payment', paymentRateLimiter, paymentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Parsian Payment Gateway API',
    version: process.env.npm_package_version || '1.0.0',
    endpoints: {
      health: '/health',
      payment: {
        create: 'POST /api/payment/create',
        callback: 'POST /api/payment/callback',
        reverse: 'POST /api/payment/reverse',
        status: 'GET /api/payment/status/:token'
      }
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
