import { SalePaymentRequest } from '../models/SalePaymentRequest.js';
import { PayResult } from '../models/PayResult.js';
import { ConfirmResult } from '../models/ConfirmResult.js';

describe('Models', () => {
  describe('SalePaymentRequest', () => {
    test('should create a valid request', () => {
      const request = new SalePaymentRequest({
        pin: 'test123',
        amount: 1000,
        orderId: 'ORDER123',
        callbackUrl: 'https://example.com/callback'
      });

      expect(request.getPin()).toBe('test123');
      expect(request.getAmount()).toBe(1000);
      expect(request.getOrderId()).toBe('ORDER123');
      expect(request.getCallbackUrl()).toBe('https://example.com/callback');
    });

    test('should validate request correctly', () => {
      const request = new SalePaymentRequest();
      const validation = request.validate();

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('PIN is required');
      expect(validation.errors).toContain('Amount must be greater than 0');
    });
  });

  describe('PayResult', () => {
    test('should create result from object', () => {
      const result = new PayResult({
        Status: 0,
        Token: 123456,
        Message: 'Success'
      });

      expect(result.getStatus()).toBe(0);
      expect(result.getToken()).toBe(123456);
      expect(result.getMessage()).toBe('Success');
      expect(result.isSuccessful()).toBe(true);
    });

    test('should handle case insensitive keys', () => {
      const result = new PayResult({
        status: 0,
        token: 123456,
        message: 'Success'
      });

      expect(result.getStatus()).toBe(0);
      expect(result.getToken()).toBe(123456);
      expect(result.getMessage()).toBe('Success');
    });
  });

  describe('ConfirmResult', () => {
    test('should create confirm result', () => {
      const result = new ConfirmResult({
        Status: 0,
        Token: 123456,
        RRN: 789012,
        CardNumberMasked: '1234****5678'
      });

      expect(result.getStatus()).toBe(0);
      expect(result.getToken()).toBe(123456);
      expect(result.getRRN()).toBe(789012);
      expect(result.getCardNumberMasked()).toBe('1234****5678');
      expect(result.isSuccessful()).toBe(true);
    });
  });
});
