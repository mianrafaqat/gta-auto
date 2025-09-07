import { NextResponse } from 'next/server';
import { sendEmail, emailConfig } from 'src/lib/nodemailer';
import { emailTemplates } from 'src/lib/emailTemplates';

export async function POST(request) {
  try {
    const { customer } = await request.json();

    // Validate required fields
    if (!customer || !customer.email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Generate email content
    const html = emailTemplates.welcome(customer);
    const text = `Welcome to Garage Tuned Autos!\n\nHi ${customer.name || 'Customer'},\n\nWelcome to Garage Tuned Autos! We're excited to have you as part of our community.\n\nYou can now:\n- Browse our extensive catalog of automotive products\n- Track your orders in real-time\n- Manage your account and preferences\n- Get exclusive deals and offers\n\nGet started by visiting our dashboard.\n\nBest regards,\nGTA Auto Team`;

    // Send email
    const result = await sendEmail({
      to: customer.email,
      subject: 'Welcome to Garage Tuned Autos!',
      html,
      text
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send welcome email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
