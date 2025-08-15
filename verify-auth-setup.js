#!/usr/bin/env node

// Simple verification script for auth setup
import { formatPhoneNumber, isValidPhoneNumber, isValidOTP } from './src/lib/auth.js';

console.log('🔍 Verifying Auth Setup...\n');

// Test phone number formatting
console.log('📱 Testing phone number formatting:');
const testNumbers = ['9876543210', '+919876543210', '919876543210', '98765-43210'];
testNumbers.forEach(num => {
  const formatted = formatPhoneNumber(num);
  console.log(`  ${num} → ${formatted}`);
});

// Test phone number validation
console.log('\n✅ Testing phone number validation:');
const validNumbers = ['9876543210', '+919876543210'];
const invalidNumbers = ['123456789', '1234567890', 'abcdefghij'];

validNumbers.forEach(num => {
  const isValid = isValidPhoneNumber(num);
  console.log(`  ${num}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});

invalidNumbers.forEach(num => {
  const isValid = isValidPhoneNumber(num);
  console.log(`  ${num}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});

// Test OTP validation
console.log('\n🔢 Testing OTP validation:');
const validOTPs = ['123456', '000000', '999999'];
const invalidOTPs = ['12345', '1234567', '12345a', '12 34 56'];

validOTPs.forEach(otp => {
  const isValid = isValidOTP(otp);
  console.log(`  ${otp}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});

invalidOTPs.forEach(otp => {
  const isValid = isValidOTP(otp);
  console.log(`  ${otp}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});

console.log('\n🎉 Auth utilities verification complete!');
console.log('\n📋 Next steps:');
console.log('1. Set up Google OAuth credentials in Google Cloud Console');
console.log('2. Set up Twilio SMS credentials in Twilio Console');
console.log('3. Update .env.local with your credentials');
console.log('4. Test the authentication flow in your application');
console.log('\nSee AUTH_SETUP.md for detailed instructions.');