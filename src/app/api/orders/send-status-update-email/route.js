import { NextResponse } from 'next/server';
import { sendEmail, emailConfig } from 'src/lib/nodemailer';
import { emailTemplates } from 'src/lib/emailTemplates';

export async function POST(request) {
  try {
    const { order, newStatus, note } = await request.json();

    // Validate required fields
    if (!order || !newStatus) {
      return NextResponse.json(
        { error: 'Order and newStatus are required' },
        { status: 400 }
      );
    }

    if (!order.customer.email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Generate email content
    const html = emailTemplates.orderStatusUpdate(order, newStatus, note);
    const text = `Order Status Update #${order.orderNumber}\n\nHi ${order.shippingAddress.firstName || 'Customer'},\n\nYour order status has been updated!\n\nOrder Number: ${order.orderNumber}\nNew Status: ${newStatus}\n${note ? `Note: ${note}` : ''}\n\nWe'll continue to keep you updated on your order progress.\n\nBest regards,\nGTA Auto Team`;
    console.log('should be sending email to', order.customer.email);
    // Send email
    const result = await sendEmail({
      to: order.customer.email,
      subject: `Order Status Update #${order.orderNumber} - Garage Tuned Autos`,
      html,
      text
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order status update email sent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send status update email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
