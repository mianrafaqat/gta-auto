# Stripe Components

Ready-to-use Stripe payment components for your Next.js application.

## 🎯 Quick Start

```jsx
import { StripePaymentWrapper } from 'src/components/stripe';

export default function MyCheckout() {
  return (
    <StripePaymentWrapper
      amount={99.99}
      onSuccess={(payment) => console.log('Success!', payment)}
    />
  );
}
```

## 📦 Available Components

### StripePaymentWrapper
Embedded payment form with Stripe Elements.

**Props:**
- `amount` (number, required) - Amount to charge
- `currency` (string, default: 'usd') - Currency code
- `metadata` (object) - Additional payment data
- `onSuccess` (function) - Success callback
- `onError` (function) - Error callback

**Example:**
```jsx
<StripePaymentWrapper
  amount={149.99}
  currency="usd"
  metadata={{
    orderId: '123',
    customerId: 'user_456'
  }}
  onSuccess={(paymentIntent) => {
    console.log('Payment successful!', paymentIntent);
    router.push('/success');
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

---

### StripeCheckoutButton
Button that redirects to Stripe's hosted checkout.

**Props:**
- `lineItems` (array, required) - Items to purchase
- `customerEmail` (string) - Customer's email
- `metadata` (object) - Additional data
- `buttonText` (string) - Button label
- `buttonProps` (object) - MUI Button props
- `onSuccess` (function) - Called before redirect
- `onError` (function) - Error callback

**Example:**
```jsx
<StripeCheckoutButton
  lineItems={[
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Car Wash Service',
        },
        unit_amount: 4999, // $49.99 in cents
      },
      quantity: 1,
    },
  ]}
  customerEmail="customer@example.com"
  buttonText="Pay Now"
  onSuccess={() => console.log('Redirecting...')}
/>
```

---

### StripeCheckoutForm
Low-level payment form component (usually used via StripePaymentWrapper).

**Props:**
- `amount` (number, required) - Amount to display
- `onSuccess` (function) - Success callback
- `onError` (function) - Error callback

---

## 🔧 API Routes

### POST /api/stripe/create-payment-intent
Creates a PaymentIntent for card payments.

**Request:**
```json
{
  "amount": 99.99,
  "currency": "usd",
  "metadata": {
    "orderId": "123"
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

---

### POST /api/stripe/create-checkout-session
Creates a Checkout Session for hosted checkout.

**Request:**
```json
{
  "line_items": [
    {
      "price_data": {
        "currency": "usd",
        "product_data": { "name": "Product" },
        "unit_amount": 9999
      },
      "quantity": 1
    }
  ],
  "customer_email": "customer@example.com",
  "metadata": { "orderId": "123" }
}
```

**Response:**
```json
{
  "id": "cs_xxx",
  "url": "https://checkout.stripe.com/xxx"
}
```

---

### POST /api/stripe/webhook
Handles Stripe webhook events.

**Supported Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.succeeded`
- `customer.created`

---

## 🎨 Usage Patterns

### Pattern 1: Simple Checkout
```jsx
<StripePaymentWrapper
  amount={total}
  onSuccess={() => router.push('/success')}
/>
```

### Pattern 2: With Order Data
```jsx
<StripePaymentWrapper
  amount={orderTotal}
  metadata={{
    orderId: order.id,
    items: JSON.stringify(order.items),
  }}
  onSuccess={async (payment) => {
    await saveOrder({ ...order, paymentId: payment.id });
    router.push('/order-confirmation');
  }}
/>
```

### Pattern 3: Conditional Payment Method
```jsx
{paymentMethod === 'card' && (
  <StripePaymentWrapper
    amount={total}
    onSuccess={handlePaymentSuccess}
  />
)}

{paymentMethod === 'redirect' && (
  <StripeCheckoutButton
    lineItems={cartItems}
    buttonText="Continue to Payment"
  />
)}
```

---

## 🧪 Testing

### Test Cards
| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 9995 | Declined |
| 4000 0025 0000 3155 | 3D Secure |

Use any CVC, future expiry date, and any ZIP code.

---

## 📚 More Information

- See `example-usage.js` for 5 complete examples
- Read `../../docs/STRIPE_INTEGRATION.md` for full guide
- Check `/STRIPE_QUICK_START.md` in project root

---

## 🔒 Security

- Never expose `STRIPE_SECRET_KEY` to client
- Always validate amounts server-side
- Verify webhook signatures
- Use HTTPS in production

---

**Ready to accept payments! 🚀**

