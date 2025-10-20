# Stripe Payment Integration Guide

This guide explains how to use the Stripe payment integration in your application.

## Table of Contents
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Usage Examples](#usage-examples)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Setup

### 1. Install Dependencies
The following packages are already installed:
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK
- `@stripe/react-stripe-js` - React components for Stripe

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with your Stripe credentials:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3033
```

**Getting Your Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your Publishable Key and Secret Key
3. For webhook secret, go to [Webhooks](https://dashboard.stripe.com/webhooks)

### 3. Set Up Webhooks (Production)
For production, configure webhooks in Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `customer.created`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with pk_) | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with sk_) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (starts with whsec_) | Yes (for webhooks) |
| `NEXT_PUBLIC_APP_URL` | Your app's URL for redirects | Yes |

## Usage Examples

### Method 1: Embedded Payment Form (Recommended)

Use this method for a custom, embedded payment experience:

```jsx
'use client';

import { StripePaymentWrapper } from 'src/components/stripe';

export default function CheckoutPage() {
  const handleSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // Update order status, send confirmation email, etc.
  };

  const handleError = (error) => {
    console.error('Payment failed:', error);
    // Show error message to user
  };

  return (
    <StripePaymentWrapper
      amount={99.99}
      currency="usd"
      metadata={{
        orderId: '12345',
        customerId: 'user_123',
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

### Method 2: Stripe Hosted Checkout

Use this method to redirect users to Stripe's hosted checkout page:

```jsx
'use client';

import { StripeCheckoutButton } from 'src/components/stripe';

export default function ProductPage() {
  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Product Name',
          description: 'Product Description',
        },
        unit_amount: 9999, // Amount in cents ($99.99)
      },
      quantity: 1,
    },
  ];

  return (
    <StripeCheckoutButton
      lineItems={lineItems}
      customerEmail="customer@example.com"
      metadata={{
        orderId: '12345',
      }}
      buttonText="Proceed to Checkout"
      onSuccess={(data) => console.log('Redirecting to Stripe...', data)}
      onError={(error) => console.error('Checkout error:', error)}
    />
  );
}
```

### Method 3: Direct API Usage

For more control, call the API directly:

```javascript
// Create Payment Intent
const response = await fetch('/api/stripe/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 99.99,
    currency: 'usd',
    metadata: {
      orderId: '12345',
    },
  }),
});

const { clientSecret, paymentIntentId } = await response.json();
```

## API Endpoints

### POST /api/stripe/create-payment-intent
Creates a Payment Intent for accepting card payments.

**Request Body:**
```json
{
  "amount": 99.99,
  "currency": "usd",
  "metadata": {
    "orderId": "12345",
    "customerId": "user_123"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### POST /api/stripe/create-checkout-session
Creates a Checkout Session for Stripe hosted checkout.

**Request Body:**
```json
{
  "line_items": [
    {
      "price_data": {
        "currency": "usd",
        "product_data": {
          "name": "Product Name"
        },
        "unit_amount": 9999
      },
      "quantity": 1
    }
  ],
  "customer_email": "customer@example.com",
  "metadata": {
    "orderId": "12345"
  }
}
```

**Response:**
```json
{
  "id": "cs_xxx",
  "url": "https://checkout.stripe.com/xxx"
}
```

### POST /api/stripe/webhook
Handles Stripe webhook events.

**Events Handled:**
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `charge.succeeded` - Charge succeeded
- `customer.created` - New customer created

## Testing

### Test Cards
Use these test cards in development:

| Card Number | Description | CVC | Date |
|-------------|-------------|-----|------|
| 4242 4242 4242 4242 | Successful payment | Any 3 digits | Any future date |
| 4000 0000 0000 9995 | Declined payment | Any 3 digits | Any future date |
| 4000 0025 0000 3155 | Requires authentication | Any 3 digits | Any future date |

### Testing Webhooks Locally
Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local endpoint
stripe listen --forward-to localhost:3033/api/stripe/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

## Components

### StripePaymentWrapper
Wraps the payment form with Stripe Elements provider.

**Props:**
- `amount` (number, required) - Payment amount
- `currency` (string, default: 'usd') - Currency code
- `metadata` (object) - Additional data to attach to payment
- `onSuccess` (function) - Called when payment succeeds
- `onError` (function) - Called when payment fails

### StripeCheckoutButton
Button that redirects to Stripe hosted checkout.

**Props:**
- `lineItems` (array, required) - Products/items to purchase
- `customerEmail` (string) - Customer's email
- `metadata` (object) - Additional data
- `buttonText` (string) - Button label
- `buttonProps` (object) - Additional button props
- `onSuccess` (function) - Called before redirect
- `onError` (function) - Called on error

## Security Best Practices

1. **Never expose secret keys** - Keep `STRIPE_SECRET_KEY` server-side only
2. **Validate webhooks** - Always verify webhook signatures
3. **Use HTTPS in production** - Required for live payments
4. **Handle errors gracefully** - Don't expose sensitive error details
5. **Validate amounts server-side** - Never trust client-side amounts

## Common Issues

### "No API key provided"
- Ensure environment variables are set correctly
- Restart your dev server after adding env variables

### "Invalid API Key"
- Check if you're using test keys in development
- Verify keys are copied correctly without extra spaces

### Webhook signature verification failed
- Ensure webhook secret is correct
- Use Stripe CLI for local testing

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Testing Guide](https://stripe.com/docs/testing)
- [Webhook Guide](https://stripe.com/docs/webhooks)

