import { NextResponse } from 'next/server';
import { sendEmail, emailConfig } from 'src/lib/nodemailer';
import { emailTemplates } from 'src/lib/emailTemplates';

export async function POST(request) {
  try {
    const quoteData = await request.json();

    // Validate required fields
    if (!quoteData || !quoteData.email || !quoteData.name || !quoteData.service) {
      return NextResponse.json(
        { error: 'Required fields missing: name, email, and service are required' },
        { status: 400 }
      );
    }

    // Generate email content for admin notification
    const adminHtml = emailTemplates.guardQuote(quoteData);
    const adminText = `Security Guard Quote Request

Service: ${quoteData.service}
Name: ${quoteData.name}
Email: ${quoteData.email}
Phone: ${quoteData.phone}
Location: ${quoteData.address}
${quoteData.durationType ? `Duration: ${quoteData.durationType}` : ''}
${quoteData.startDate ? `Start Date: ${quoteData.startDate}` : ''}
${quoteData.shiftPreference ? `Shift: ${quoteData.shiftPreference}` : ''}
${quoteData.numberOfGuards ? `Number of Guards: ${quoteData.numberOfGuards}` : ''}
${quoteData.eventType ? `Event Type: ${quoteData.eventType}` : ''}

Message: ${quoteData.message}

Request Date: ${new Date().toLocaleString()}`;

    // Generate confirmation email for customer
    const customerHtml = emailTemplates.guardQuoteConfirmation(quoteData);
    const customerText = `Hi ${quoteData.name},

Thank you for your interest in our security guard services! We've received your quote request and will get back to you shortly.

Service Requested: ${quoteData.service}
Location: ${quoteData.address}

We'll respond within 24 hours.

Need immediate assistance?
Call us: +92 326 3333456
Email: support@garagetunedautos.com

Best regards,
Garage Tuned Autos Security Services`;

    // Send admin notification email
    const adminResult = await sendEmail({
      to: emailConfig.adminEmails,
      subject: `🛡️ New Guard Quote Request - ${quoteData.service}`,
      html: adminHtml,
      text: adminText
    });

    // Send customer confirmation email
    const customerResult = await sendEmail({
      to: quoteData.email,
      subject: 'Guard Quote Request Received - Garage Tuned Autos',
      html: customerHtml,
      text: customerText
    });

    if (adminResult.success && customerResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Quote request emails sent successfully',
        adminMessageId: adminResult.messageId,
        customerMessageId: customerResult.messageId
      });
    } else {
      const errors = [];
      if (!adminResult.success) errors.push(`Admin: ${adminResult.error}`);
      if (!customerResult.success) errors.push(`Customer: ${customerResult.error}`);
      
      return NextResponse.json(
        { 
          error: 'Failed to send one or more emails', 
          details: errors.join(', '),
          adminSuccess: adminResult.success,
          customerSuccess: customerResult.success
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending guard quote emails:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

