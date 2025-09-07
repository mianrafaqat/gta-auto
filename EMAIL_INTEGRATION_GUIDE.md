# Email Integration Guide

## 🎯 **Complete Email System Integration**

Your Garage Tuned Autos project now has a fully integrated email system using Nodemailer with Next.js API routes. Here's everything you need to know:

## 📁 **Files Created/Updated**

### **Core Email System:**
- ✅ `src/lib/nodemailer.js` - Nodemailer configuration
- ✅ `src/lib/emailTemplates.js` - Professional HTML email templates
- ✅ `src/lib/emailService.js` - Centralized email service class

### **API Endpoints:**
- ✅ `src/app/api/orders/send-confirmation-email/route.js`
- ✅ `src/app/api/orders/send-admin-notification/route.js`
- ✅ `src/app/api/orders/send-status-update-email/route.js`
- ✅ `src/app/api/orders/[id]/resend-confirmation/route.js`
- ✅ `src/app/api/email/send-welcome/route.js`
- ✅ `src/app/api/email/verify-config/route.js`

### **Frontend Integration:**
- ✅ `src/services/orders/orderEmail.service.js` - Updated to use local APIs
- ✅ `src/hooks/use-email.js` - React hooks for email functionality
- ✅ `src/hooks/use-orders.js` - Updated with email integration
- ✅ `src/sections/checkout/checkout-payment.js` - Integrated email sending
- ✅ `src/utils/apiUrls.js` - Added email endpoints

### **Admin Components:**
- ✅ `src/components/admin/email-management/index.js`
- ✅ `src/components/admin/email-test/index.js`

## 🚀 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install nodemailer
```

### **2. Environment Configuration**
Create `.env.local` file in your project root:

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

### **3. Gmail Setup**
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification
   - Click "App passwords"
   - Select "Mail" and generate password
   - Use this password in `EMAIL_PASS`

## 📧 **Email Features**

### **Automatic Email Sending:**
- ✅ **Order Confirmation** - Sent to customer when order is created
- ✅ **Admin Notification** - Sent to admin team for new orders
- ✅ **Status Updates** - Sent when order status changes
- ✅ **Welcome Emails** - Sent to new customers

### **Manual Email Operations:**
- ✅ **Resend Confirmation** - Resend order confirmation emails
- ✅ **Test Emails** - Send test emails to verify configuration
- ✅ **Bulk Emails** - Send emails to multiple recipients

## 🔧 **Usage Examples**

### **1. Order Creation with Emails**
```javascript
// In checkout-payment.js - automatically sends emails
const order = await createOrderMutation.mutateAsync(orderData);
const emailResults = await sendOrderEmailsMutation.mutateAsync({
  order: order.order || order,
  customer: { name: "John Doe", email: "john@example.com" }
});
```

### **2. Manual Email Sending**
```javascript
import { useSendOrderConfirmationEmail } from 'src/hooks/use-email';

const sendEmail = useSendOrderConfirmationEmail();

await sendEmail.mutateAsync({
  order: orderData,
  customer: customerData
});
```

### **3. Status Update with Email**
```javascript
import { useUpdateOrderStatus } from 'src/hooks/use-orders';

const updateStatus = useUpdateOrderStatus();

await updateStatus.mutateAsync({
  id: orderId,
  data: { status: 'shipped', note: 'Order shipped!' },
  sendEmail: true // Automatically sends status update email
});
```

## 🎨 **Email Templates**

### **Professional HTML Templates:**
- **Order Confirmation** - Complete order details with Garage Tuned Autos branding
- **Admin Notification** - Urgent alert styling for admin team
- **Status Update** - Clean status change notifications
- **Welcome Email** - Professional welcome message

### **Template Features:**
- ✅ Responsive design for all devices
- ✅ Garage Tuned Autos branding and colors
- ✅ Professional styling
- ✅ Complete order information
- ✅ Action buttons and links

## 🔍 **Testing & Verification**

### **1. Test Email Configuration**
```javascript
import { useVerifyEmailConfig } from 'src/hooks/use-email';

const { data: config } = useVerifyEmailConfig();
// Returns: { success: true, message: "Email configuration verified successfully" }
```

### **2. Send Test Email**
```javascript
import { useSendWelcomeEmail } from 'src/hooks/use-email';

const sendWelcome = useSendWelcomeEmail();
await sendWelcome.mutateAsync({
  name: "Test User",
  email: "test@example.com"
});
```

### **3. Admin Email Test Component**
Use the `EmailTest` component in your admin panel:
```javascript
import EmailTest from 'src/components/admin/email-test';

<EmailTest />
```

## 📊 **API Endpoints Reference**

### **Order Emails:**
- `POST /api/orders/send-confirmation-email`
- `POST /api/orders/send-admin-notification`
- `POST /api/orders/send-status-update-email`
- `POST /api/orders/[id]/resend-confirmation`

### **General Emails:**
- `POST /api/email/send-welcome`
- `GET /api/email/verify-config`

## 🛠 **Admin Features**

### **Email Management Component:**
- Verify email configuration
- Send welcome emails
- Resend order confirmations
- View email status

### **Email Test Component:**
- Test email configuration
- Send test emails
- View setup instructions

## 🔒 **Security & Best Practices**

### **Environment Variables:**
- ✅ Never commit email credentials to version control
- ✅ Use App Passwords instead of regular passwords
- ✅ Rotate credentials regularly

### **Error Handling:**
- ✅ Graceful failure handling
- ✅ User-friendly error messages
- ✅ Logging for debugging

### **Rate Limiting:**
- ✅ Consider implementing rate limiting for production
- ✅ Monitor email sending limits

## 🚨 **Troubleshooting**

### **Common Issues:**

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

### **Debug Steps:**
1. Use the email test component
2. Check browser console for errors
3. Verify environment variables
4. Test with a simple email first

## 📈 **Production Deployment**

### **Environment Variables for Production:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
ADMIN_EMAILS=admin@yourdomain.com,support@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### **Monitoring:**
- Monitor email delivery rates
- Set up email bounce handling
- Track email open rates (if needed)

## 🎉 **You're All Set!**

Your email system is now fully integrated and ready to use. The system will automatically:

1. **Send order confirmation emails** when orders are created
2. **Notify admin team** about new orders
3. **Send status updates** when order status changes
4. **Provide manual email controls** for admin users

All emails use professional templates with Garage Tuned Autos branding and are fully responsive for all devices.

## 📞 **Support**

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your environment variables
3. Test with the email test component
4. Check the browser console for errors

The email system is now fully functional and integrated with your existing order management system!
