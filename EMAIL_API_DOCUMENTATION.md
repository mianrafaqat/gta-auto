# Email API Documentation

## Overview

This document describes the email API endpoints for the Garage Tuned Autos application. The email system uses Nodemailer with Gmail SMTP to send various types of notifications.

## Setup

### Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=cityautosuk@gmail.com
EMAIL_PASS=your-app-password-here

# Admin Email Configuration
ADMIN_EMAIL=admin@gta-auto.com
ADMIN_EMAILS=admin@gta-auto.com,support@gta-auto.com

# Frontend URL
FRONTEND_URL=http://localhost:3033
```

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

## API Endpoints

### 1. Send Order Confirmation Email

**Endpoint:** `POST /api/orders/send-confirmation-email`

**Description:** Sends order confirmation email to customer

**Request Body:**
```json
{
  "order": {
    "orderNumber": "ORD-12345",
    "createdAt": "2024-01-15T10:30:00Z",
    "paymentMethod": "cash",
    "subtotal": 1000,
    "discountAmount": 100,
    "shippingPrice": 200,
    "taxAmount": 50,
    "finalTotal": 1150,
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "address1": "123 Main St",
      "city": "Karachi",
      "state": "Sindh",
      "postcode": "75000",
      "country": "Pakistan"
    },
    "items": [
      {
        "name": "Product Name",
        "quantity": 2,
        "priceAtOrder": 500
      }
    ]
  },
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order confirmation email sent successfully",
  "messageId": "message-id-here"
}
```

### 2. Send Admin Notification Email

**Endpoint:** `POST /api/orders/send-admin-notification`

**Description:** Sends notification email to admin team about new order

**Request Body:**
```json
{
  "order": {
    "orderNumber": "ORD-12345",
    "createdAt": "2024-01-15T10:30:00Z",
    "paymentMethod": "cash",
    "finalTotal": 1150,
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "address1": "123 Main St",
      "city": "Karachi",
      "state": "Sindh",
      "postcode": "75000",
      "country": "Pakistan"
    },
    "items": [
      {
        "name": "Product Name",
        "quantity": 2,
        "priceAtOrder": 500
      }
    ]
  },
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin notification email sent successfully",
  "messageId": "message-id-here",
  "recipients": ["admin@gta-auto.com", "support@gta-auto.com"]
}
```

### 3. Send Order Status Update Email

**Endpoint:** `POST /api/orders/send-status-update-email`

**Description:** Sends email to customer when order status changes

**Request Body:**
```json
{
  "order": {
    "orderNumber": "ORD-12345",
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  },
  "newStatus": "shipped",
  "note": "Your order has been shipped and is on its way!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status update email sent successfully",
  "messageId": "message-id-here"
}
```

### 4. Resend Order Confirmation Email

**Endpoint:** `POST /api/orders/[id]/resend-confirmation`

**Description:** Resends order confirmation email for a specific order

**Request Body:**
```json
{
  "order": {
    "orderNumber": "ORD-12345",
    "createdAt": "2024-01-15T10:30:00Z",
    "paymentMethod": "cash",
    "finalTotal": 1150,
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "items": []
  },
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order confirmation email resent successfully",
  "messageId": "message-id-here"
}
```

### 5. Send Welcome Email

**Endpoint:** `POST /api/email/send-welcome`

**Description:** Sends welcome email to new customer

**Request Body:**
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "messageId": "message-id-here"
}
```

### 6. Verify Email Configuration

**Endpoint:** `GET /api/email/verify-config`

**Description:** Verifies email configuration and SMTP connection

**Response:**
```json
{
  "success": true,
  "message": "Email configuration verified successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

Common error codes:
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error (email sending failed)

## Usage Examples

### Frontend Integration

```javascript
// Send order confirmation email
const sendOrderConfirmation = async (order, customer) => {
  try {
    const response = await fetch('/api/orders/send-confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order, customer }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Email sent successfully:', result.messageId);
    } else {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Send admin notification
const sendAdminNotification = async (order, customer) => {
  try {
    const response = await fetch('/api/orders/send-admin-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order, customer }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Using Email Service

```javascript
import emailService from 'src/lib/emailService';

// Send order confirmation
const result = await emailService.sendOrderConfirmationEmail(order, customer);

// Send admin notification
const result = await emailService.sendAdminNotificationEmail(order, customer);

// Send status update
const result = await emailService.sendOrderStatusUpdateEmail(order, 'shipped', 'Order shipped!');
```

## Email Templates

The system includes professional HTML email templates for:

1. **Order Confirmation** - Customer order confirmation with order details
2. **Admin Notification** - Alert for admin team about new orders
3. **Order Status Update** - Customer notification about status changes
4. **Welcome Email** - Welcome message for new customers

All templates are responsive and include Garage Tuned Autos branding.

## Security Considerations

1. **Environment Variables** - Never commit email credentials to version control
2. **Rate Limiting** - Consider implementing rate limiting for email endpoints
3. **Validation** - All inputs are validated before processing
4. **Error Handling** - Sensitive information is not exposed in error messages

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check Gmail app password
   - Ensure 2FA is enabled
   - Verify email credentials

2. **Connection Timeout**
   - Check network connectivity
   - Verify SMTP settings
   - Check firewall settings

3. **Email Not Delivered**
   - Check spam folder
   - Verify recipient email address
   - Check Gmail sending limits

### Testing

Use the verify configuration endpoint to test your email setup:

```bash
curl -X GET http://localhost:3033/api/email/verify-config
```

## Support

For issues or questions regarding the email system, contact the development team or check the application logs for detailed error information.
