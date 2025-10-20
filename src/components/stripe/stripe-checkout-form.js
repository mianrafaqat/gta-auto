'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { 
  Box, 
  Button, 
  Alert, 
  CircularProgress, 
  Typography 
} from '@mui/material';

export default function StripeCheckoutForm({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent form submission

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Don't redirect, we'll handle it manually
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      if (onError) onError(error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful! Creating your order...');
      // Don't set isLoading to false yet - keep it true until order is created
      if (onSuccess) {
        try {
          await onSuccess(paymentIntent);
          // onSuccess handler will handle navigation
        } catch (err) {
          setMessage(err.message || 'Error processing payment');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } else {
      setMessage('Payment status: ' + (paymentIntent?.status || 'unknown'));
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <PaymentElement />
      
      {message && (
        <Alert 
          severity={message.includes('successful') ? 'success' : 'error'} 
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}

      <Button
        type="button"
        variant="contained"
        size="large"
        fullWidth
        disabled={isLoading || !stripe || !elements}
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Pay PKR ${amount?.toFixed(2) || '0.00'}`
        )}
      </Button>

      {!stripe && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          Loading payment form...
        </Typography>
      )}
    </Box>
  );
}

