/**
 * EXAMPLE USAGE FILE - DO NOT IMPORT IN PRODUCTION
 * 
 * This file demonstrates different ways to integrate Stripe payments
 * into your application. Copy the relevant code to your actual components.
 */

// ============================================================================
// EXAMPLE 1: Simple Checkout with Embedded Payment Form
// ============================================================================
'use client';

import { useState } from 'react';
import { StripePaymentWrapper } from './index';
import { Box, Card, CardContent, Typography, Divider } from '@mui/material';

function Example1_EmbeddedCheckout() {
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Your cart total
  const cartTotal = 149.99;
  
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful!', paymentIntent);
    setOrderComplete(true);
    
    // TODO: Add your business logic here:
    // - Update order status in database
    // - Send confirmation email
    // - Clear cart
    // - Redirect to order confirmation page
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // TODO: Show error message to user
  };

  if (orderComplete) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order Complete! 🎉
        </Typography>
        <Typography>Thank you for your purchase.</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Complete Your Purchase
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Order Total
          </Typography>
          <Typography variant="h4">
            ${cartTotal.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <StripePaymentWrapper
          amount={cartTotal}
          currency="usd"
          metadata={{
            orderId: 'ORDER-123',
            customerEmail: 'customer@example.com',
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 2: Stripe Hosted Checkout (Redirect)
// ============================================================================

import { StripeCheckoutButton } from './index';

function Example2_HostedCheckout() {
  // Your cart items
  const cartItems = [
    { name: 'Product 1', price: 29.99, quantity: 2 },
    { name: 'Product 2', price: 49.99, quantity: 1 },
  ];

  // Convert to Stripe line items format
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Your Cart
          </Typography>
          
          {cartItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <StripeCheckoutButton
            lineItems={lineItems}
            customerEmail="customer@example.com"
            metadata={{
              orderId: 'ORDER-456',
              source: 'web',
            }}
            buttonText="Proceed to Secure Checkout"
            buttonProps={{
              size: 'large',
              color: 'primary',
            }}
            onSuccess={(data) => {
              console.log('Redirecting to Stripe Checkout...', data);
            }}
            onError={(error) => {
              alert('Checkout failed: ' + error.message);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

// ============================================================================
// EXAMPLE 3: Integration with existing checkout flow
// ============================================================================

import { useRouter } from 'next/navigation';

function Example3_IntegrateWithExistingCheckout() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // or 'cod', 'bank', etc.

  const orderData = {
    items: [
      { id: 1, name: 'Car Service', price: 299.99 },
    ],
    subtotal: 299.99,
    tax: 29.99,
    total: 329.98,
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
  };

  const handleStripeSuccess = async (paymentIntent) => {
    // Save order to database
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          paymentIntentId: paymentIntent.id,
          paymentStatus: 'paid',
        }),
      });

      const order = await response.json();
      
      // Redirect to order confirmation
      router.push(`/dashboard/my-orders/${order.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  return (
    <Box>
      {/* Your existing checkout form */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Order Summary</Typography>
          {/* ... order details ... */}
        </CardContent>
      </Card>

      {/* Payment method selection */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          {/* Your payment method selector */}
        </CardContent>
      </Card>

      {/* Show Stripe payment if selected */}
      {paymentMethod === 'stripe' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Card Payment
            </Typography>
            <StripePaymentWrapper
              amount={orderData.total}
              currency="usd"
              metadata={{
                customerName: orderData.customerInfo.name,
                customerEmail: orderData.customerInfo.email,
                items: JSON.stringify(orderData.items),
              }}
              onSuccess={handleStripeSuccess}
              onError={(error) => {
                console.error('Payment failed:', error);
              }}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

// ============================================================================
// EXAMPLE 4: Using the API directly (Advanced)
// ============================================================================

async function Example4_DirectAPIUsage() {
  // Step 1: Create Payment Intent
  const createPayment = async () => {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 99.99,
        currency: 'usd',
        metadata: {
          orderId: 'ORD-789',
          customerId: 'CUST-123',
        },
      }),
    });

    const { clientSecret, paymentIntentId } = await response.json();
    
    // Use clientSecret with Stripe.js to collect payment
    return { clientSecret, paymentIntentId };
  };

  // Step 2: Create Checkout Session (for hosted checkout)
  const createCheckoutSession = async () => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Car Detailing Service',
                description: 'Premium car detailing package',
                images: ['https://example.com/image.jpg'],
              },
              unit_amount: 29999, // $299.99 in cents
            },
            quantity: 1,
          },
        ],
        customer_email: 'customer@example.com',
        success_url: `${window.location.origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/shop/checkout`,
        metadata: {
          orderId: 'ORD-789',
        },
      }),
    });

    const { id, url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  };

  // Usage
  // await createPayment();
  // await createCheckoutSession();
}

// ============================================================================
// EXAMPLE 5: Handling Subscriptions (for recurring payments)
// ============================================================================

function Example5_SubscriptionCheckout() {
  // For subscriptions, use price IDs created in Stripe Dashboard
  const subscriptionLineItems = [
    {
      price: 'price_1234567890', // Your Stripe Price ID
      quantity: 1,
    },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Premium Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            $29.99 / month
          </Typography>

          <StripeCheckoutButton
            lineItems={subscriptionLineItems}
            customerEmail="customer@example.com"
            metadata={{
              subscriptionType: 'premium',
            }}
            buttonText="Subscribe Now"
            // Note: Set mode to 'subscription' in the API route
          />
        </CardContent>
      </Card>
    </Box>
  );
}

// Export examples (remove in production)
export {
  Example1_EmbeddedCheckout,
  Example2_HostedCheckout,
  Example3_IntegrateWithExistingCheckout,
  Example4_DirectAPIUsage,
  Example5_SubscriptionCheckout,
};

