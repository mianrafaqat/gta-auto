import { NextResponse } from 'next/server';
import { sendEmail, emailConfig } from 'src/lib/nodemailer';
import { emailTemplates } from 'src/lib/emailTemplates';

export async function POST(request) {
  try {
    const { order, customer } = await request.json();

    // Validate required fields
    if (!order || !customer) {
      return NextResponse.json(
        { error: 'Order and customer data are required' },
        { status: 400 }
      );
    }

    // Generate email content
    const html = emailTemplates.adminNotification(order, customer);
    const text = `New Order Alert #${order.orderNumber}\n\nA new order has been received and requires immediate attention.\n\nOrder Number: ${order.orderNumber}\nCustomer: ${customer.name || 'N/A'}\nEmail: ${order.shippingAddress.email}\nTotal: PKR ${order.finalTotal?.toLocaleString() || '0'}\n\nPlease process this order as soon as possible.\n\nGTA Auto Admin System`;

    // Send email to all admin emails
    const result = await sendEmail({
      to: emailConfig.adminEmails,
      subject: `🚨 New Order Alert #${order.orderNumber} - Garage Tuned Autos`,
      html,
      text
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Admin notification email sent successfully',
        messageId: result.messageId,
        recipients: emailConfig.adminEmails
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send admin notification email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
