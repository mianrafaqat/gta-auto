// Stripe configuration
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key is not set. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.');
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Stripe API configuration for server-side
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: 'pkr', // Pakistani Rupee
  successUrl: process.env.APP_URL || 'http://localhost:3033',
  cancelUrl: process.env.APP_URL || 'http://localhost:3033',
};

