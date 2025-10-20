'use client';

import { useState, useEffect, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from 'src/config/stripe';
import { Box, CircularProgress, Alert } from '@mui/material';
import StripeCheckoutForm from './stripe-checkout-form';

export default function StripePaymentWrapper({ 
  amount, 
  currency = 'pkr',
  metadata = {},
  onSuccess,
  onError 
}) {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const stripePromise = getStripe();

  // Check if Stripe is properly configured
  if (!stripePromise) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Stripe is not properly configured. Please check your environment variables.
      </Alert>
    );
  }

  // Create a stable reference for metadata to avoid unnecessary re-renders
  const metadataString = useMemo(() => JSON.stringify(metadata), [metadata]);

  useEffect(() => {
    // Reset states when amount changes
    setLoading(true);
    setError(null);
    setClientSecret('');

    // Create PaymentIntent as soon as the component mounts or amount changes
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            currency,
            metadata: JSON.parse(metadataString),
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          if (onError) onError(new Error(data.error));
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setError(err.message);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    if (amount && amount > 0) {
      createPaymentIntent();
    } else {
      setError('Invalid amount');
      setLoading(false);
    }
  }, [amount, currency, metadataString, onError]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0066cc',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {clientSecret && (
        <Elements 
          key={clientSecret} 
          options={options} 
          stripe={stripePromise}
        >
          <StripeCheckoutForm 
            amount={amount} 
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      )}
    </Box>
  );
}

