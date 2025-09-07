import { NextResponse } from 'next/server';
import { sendEmail, emailConfig } from 'src/lib/nodemailer';
import { emailTemplates } from 'src/lib/emailTemplates';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { order, customer } = await request.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!order || !customer) {
      return NextResponse.json(
        { error: 'Order and customer data are required' },
        { status: 400 }
      );
    }

    if (!order.shippingAddress?.email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Generate email content
    const html = emailTemplates.orderConfirmation(order, customer);
    const text = `Order Confirmation #${order.orderNumber}\n\nHi ${customer.name || 'Customer'},\n\nThank you for your order! Your order has been received and is being processed.\n\nOrder Number: ${order.orderNumber}\nOrder Date: ${new Date(order.createdAt).toLocaleDateString()}\nTotal: PKR ${order.finalTotal?.toLocaleString() || '0'}\n\nWe'll send you another email when your order ships.\n\nBest regards,\nGTA Auto Team`;

    // Send email
    const result = await sendEmail({
      to: order.shippingAddress.email,
      subject: `Order Confirmation #${order.orderNumber} - Garage Tuned Autos (Resent)`,
      html,
      text
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order confirmation email resent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to resend confirmation email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error resending order confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
