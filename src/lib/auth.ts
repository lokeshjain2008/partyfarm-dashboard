import { supabase } from './supabase.js';
import type { AuthError, User, Session } from '@supabase/supabase-js';
import type { Database } from './types/database';

export type AuthProvider = 'google' | 'phone';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface PhoneAuthResponse {
  error: AuthError | null;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return {
    user: null, // OAuth redirect doesn't return user immediately
    session: null, // OAuth redirect doesn't return session immediately
    error,
  };
}

/**
 * Send OTP to phone number
 */
export async function sendPhoneOTP(phone: string): Promise<PhoneAuthResponse> {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: 'sms',
    },
  });

  return { error };
}

/**
 * Verify phone OTP and sign in
 */
export async function verifyPhoneOTP(phone: string, token: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getSession();
  return {
    session: data.session,
    error,
  };
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getUser();
  return {
    user: data.user,
    error,
  };
}

/**
 * Refresh current session
 */
export async function refreshSession(): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.refreshSession();
  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Format phone number for international format
 * Assumes Indian phone numbers for now, can be extended
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 91, it's already in international format
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it's a 10-digit number, add +91 prefix
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // Return as-is if we can't determine the format
  return `+${cleaned}`;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Basic validation for Indian phone numbers
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  return phoneRegex.test(formatted);
}

/**
 * Validate OTP format
 */
export function isValidOTP(otp: string): boolean {
  // OTP should be 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}