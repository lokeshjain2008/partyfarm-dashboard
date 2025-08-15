import { describe, it, expect } from 'vitest';
import { formatPhoneNumber, isValidPhoneNumber, isValidOTP } from './auth.js';

describe('Auth Utilities', () => {
  describe('formatPhoneNumber', () => {
    it('should format 10-digit Indian number', () => {
      expect(formatPhoneNumber('9876543210')).toBe('+919876543210');
    });

    it('should handle number with +91 prefix', () => {
      expect(formatPhoneNumber('+919876543210')).toBe('+919876543210');
    });

    it('should handle number with 91 prefix', () => {
      expect(formatPhoneNumber('919876543210')).toBe('+919876543210');
    });

    it('should handle number with spaces and dashes', () => {
      expect(formatPhoneNumber('98765-43210')).toBe('+919876543210');
      expect(formatPhoneNumber('9876 543 210')).toBe('+919876543210');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct Indian phone numbers', () => {
      expect(isValidPhoneNumber('9876543210')).toBe(true);
      expect(isValidPhoneNumber('+919876543210')).toBe(true);
      expect(isValidPhoneNumber('919876543210')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123456789')).toBe(false); // Too short
      expect(isValidPhoneNumber('1234567890')).toBe(false); // Doesn't start with 6-9
      expect(isValidPhoneNumber('98765432101')).toBe(false); // Too long
      expect(isValidPhoneNumber('abcdefghij')).toBe(false); // Non-numeric
    });
  });

  describe('isValidOTP', () => {
    it('should validate correct OTP format', () => {
      expect(isValidOTP('123456')).toBe(true);
      expect(isValidOTP('000000')).toBe(true);
      expect(isValidOTP('999999')).toBe(true);
    });

    it('should reject invalid OTP format', () => {
      expect(isValidOTP('12345')).toBe(false); // Too short
      expect(isValidOTP('1234567')).toBe(false); // Too long
      expect(isValidOTP('12345a')).toBe(false); // Contains letter
      expect(isValidOTP('12 34 56')).toBe(false); // Contains spaces
    });
  });
});