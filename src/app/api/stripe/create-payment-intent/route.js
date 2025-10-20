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

export async function POST(request) {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not properly configured. Please contact support.' },
        { status: 500 }
      );
    }
    const body = await request.json();
    const { amount, currency = 'usd', metadata = {} } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

