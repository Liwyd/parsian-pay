/**
 * Basic usage example for Parsian Payment Gateway
 */

import { Pay } from '../src/services/Pay.js';
import { Callback } from '../src/services/Callback.js';
import { Reverse } from '../src/services/Reverse.js';

// Example: Create a payment request
async function createPayment() {
  try {
    const payService = new Pay('your_parsian_pin_here');
    payService.createLogger();

    const orderId = Date.now().toString();
    const amount = 10000; // 10,000 Toman
    const callbackUrl = 'https://yourdomain.com/callback';

    const result = await payService.payment(orderId, amount, callbackUrl);

    if (result.isSuccessful()) {
      console.log('Payment request created successfully');
      console.log('Token:', result.getToken());
      console.log('Redirect URL:', payService.getRedirectUrl());
      
      // In a real application, you would redirect the user to the payment gateway
      // res.redirect(payService.getRedirectUrl());
    } else {
      console.error('Payment request failed:', result.getMessage());
    }
  } catch (error) {
    console.error('Error creating payment:', error.message);
  }
}

// Example: Handle payment callback
async function handleCallback(postData) {
  try {
    const callbackService = new Callback('your_parsian_pin_here');
    callbackService.createLogger();

    const result = await callbackService.confirm(postData);

    if (result && result.isSuccessful()) {
      console.log('Payment confirmed successfully');
      console.log('Token:', result.getToken());
      console.log('RRN:', result.getRRN());
      console.log('Card Number:', result.getCardNumberMasked());
      
      return result;
    } else {
      console.error('Payment confirmation failed:', result ? result.getMessage() : 'Unknown error');
    }
  } catch (error) {
    console.error('Error handling callback:', error.message);
  }
}

// Example: Reverse a payment
async function reversePayment(token) {
  try {
    const reverseService = new Reverse('your_parsian_pin_here');
    reverseService.createLogger();

    const result = await reverseService.reverse(token);

    if (result && result.isSuccessful()) {
      console.log('Payment reversed successfully');
      console.log('Token:', result.getToken());
      
      return result;
    } else {
      console.error('Payment reversal failed:', result ? result.getMessage() : 'Unknown error');
    }
  } catch (error) {
    console.error('Error reversing payment:', error.message);
  }
}

// Example: Express.js route handlers
export function setupPaymentRoutes(app) {
  // Create payment
  app.post('/payment/create', async (req, res) => {
    try {
      const { amount, orderId, callbackUrl } = req.body;
      const payService = new Pay(process.env.PARSIAN_PIN);
      payService.createLogger();

      const result = await payService.payment(orderId, amount, callbackUrl);

      if (result.isSuccessful()) {
        res.json({
          success: true,
          redirectUrl: payService.getRedirectUrl(),
          token: result.getToken()
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.getMessage()
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // Handle callback
  app.post('/payment/callback', async (req, res) => {
    try {
      const callbackService = new Callback(process.env.PARSIAN_PIN);
      callbackService.createLogger();

      const result = await callbackService.confirm(req.body);

      if (result && result.isSuccessful()) {
        res.json({
          success: true,
          message: 'Payment confirmed'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result ? result.getMessage() : 'Payment failed'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });
}

