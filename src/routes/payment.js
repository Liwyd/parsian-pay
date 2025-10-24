import express from 'express';
import { Pay } from '../services/Pay.js';
import { Callback } from '../services/Callback.js';
import { Reverse } from '../services/Reverse.js';
import { generateOrderId, isValidAmount, isValidUrl } from '../utils/helpers.js';

const router = express.Router();

/**
 * Create payment request
 * POST /api/payment/create
 */
router.post('/create', async (req, res) => {
  try {
    const { amount, orderId, callbackUrl, additionalData } = req.body;
    const pin = process.env.PARSIAN_PIN;

    if (!pin) {
      return res.status(500).json({
        success: false,
        message: 'Parsian PIN not configured'
      });
    }

    // Validate required fields
    if (!amount || !isValidAmount(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    if (!callbackUrl || !isValidUrl(callbackUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Valid callback URL is required'
      });
    }

    // Generate order ID if not provided
    const finalOrderId = orderId || generateOrderId();

    const payService = new Pay(pin);
    payService.createLogger();

    const result = await payService.payment(
      finalOrderId,
      amount,
      callbackUrl,
      additionalData || ''
    );

    if (result.isSuccessful()) {
      const redirectUrl = payService.getRedirectUrl();
      return res.json({
        success: true,
        data: {
          orderId: finalOrderId,
          token: result.getToken(),
          redirectUrl: redirectUrl,
          message: 'Payment request created successfully'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.getMessage(),
        data: {
          orderId: finalOrderId,
          status: result.getStatus(),
          token: result.getToken()
        }
      });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Handle payment callback
 * POST /api/payment/callback
 */
router.post('/callback', async (req, res) => {
  try {
    const pin = process.env.PARSIAN_PIN;

    if (!pin) {
      return res.status(500).json({
        success: false,
        message: 'Parsian PIN not configured'
      });
    }

    const callbackService = new Callback(pin);
    callbackService.createLogger();

    const result = await callbackService.confirm(req.body);

    if (result && result.isSuccessful()) {
      return res.json({
        success: true,
        data: {
          token: result.getToken(),
          rrn: result.getRRN(),
          cardNumberMasked: result.getCardNumberMasked(),
          message: 'Payment confirmed successfully'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result ? result.getMessage() : 'Payment confirmation failed',
        data: result ? result.toObject() : null
      });
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Reverse payment
 * POST /api/payment/reverse
 */
router.post('/reverse', async (req, res) => {
  try {
    const { token } = req.body;
    const pin = process.env.PARSIAN_PIN;

    if (!pin) {
      return res.status(500).json({
        success: false,
        message: 'Parsian PIN not configured'
      });
    }

    if (!token || token <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid token is required'
      });
    }

    const reverseService = new Reverse(pin);
    reverseService.createLogger();

    const result = await reverseService.reverse(parseInt(token));

    if (result && result.isSuccessful()) {
      return res.json({
        success: true,
        data: {
          token: result.getToken(),
          message: 'Payment reversed successfully'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result ? result.getMessage() : 'Payment reversal failed',
        data: result ? result.toObject() : null
      });
    }
  } catch (error) {
    console.error('Payment reversal error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get payment status
 * GET /api/payment/status/:token
 */
router.get('/status/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const pin = process.env.PARSIAN_PIN;

    if (!pin) {
      return res.status(500).json({
        success: false,
        message: 'Parsian PIN not configured'
      });
    }

    if (!token || token <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid token is required'
      });
    }

    // Note: This is a placeholder. Parsian doesn't provide a direct status check API
    // You would need to implement your own status tracking
    return res.json({
      success: true,
      data: {
        token: parseInt(token),
        message: 'Status check not implemented. Use callback endpoint for payment confirmation.'
      }
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
