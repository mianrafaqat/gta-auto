import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not properly configured. Please contact support.' },
        { status: 500 }
      );
    }
    
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret is not configured.' },
        { status: 500 }
      );
    }
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        // Add your business logic here (update order status, send confirmation email, etc.)
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed:', failedPayment.id);
        // Add your business logic here (notify user, update order status, etc.)
        break;

      case 'charge.succeeded':
        const charge = event.data.object;
        console.log('Charge succeeded:', charge.id);
        break;

      case 'customer.created':
        const customer = event.data.object;
        console.log('Customer created:', customer.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

