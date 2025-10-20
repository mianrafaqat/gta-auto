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
    const { 
      line_items, 
      success_url, 
      cancel_url, 
      metadata = {},
      customer_email,
      mode = 'payment'
    } = body;

    // Validate line items
    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid line items' },
        { status: 400 }
      );
    }

    const sessionParams = {
      payment_method_types: ['card'],
      line_items,
      mode,
      success_url: success_url || `${process.env.APP_URL || 'http://localhost:3033'}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.APP_URL || 'http://localhost:3033'}/shop/checkout`,
      metadata,
    };

    // Add customer email if provided
    if (customer_email) {
      sessionParams.customer_email = customer_email;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

