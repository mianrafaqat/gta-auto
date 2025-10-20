'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

/**
 * Button component that creates a Stripe Checkout Session
 * and redirects to the Stripe hosted checkout page
 */
export default function StripeCheckoutButton({ 
  lineItems,
  customerEmail,
  metadata = {},
  buttonText = 'Checkout with Stripe',
  buttonProps = {},
  onSuccess,
  onError 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line_items: lineItems,
          customer_email: customerEmail,
          metadata,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (onSuccess) onSuccess(data);

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (onError) onError(error);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      size="large"
      fullWidth
      onClick={handleCheckout}
      disabled={loading}
      {...buttonProps}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
    </Button>
  );
}

