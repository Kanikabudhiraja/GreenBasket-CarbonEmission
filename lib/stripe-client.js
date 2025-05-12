'use client';

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe promise for client-side usage only
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}; 