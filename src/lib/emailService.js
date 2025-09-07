import { sendEmail, emailConfig } from './nodemailer';
import { emailTemplates } from './emailTemplates';

/**
 * Email Service - Centralized email operations
 */
class EmailService {
  /**
   * Send order confirmation email to customer
   * @param {Object} order - Order data
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>}
   */
  async sendOrderConfirmationEmail(order, customer) {
    try {
      if (!order?.shippingAddress?.email) {
        throw new Error('Customer email is required');
      }

      const html = emailTemplates.orderConfirmation(order, customer);
      const text = `Order Confirmation #${order.orderNumber}\n\nHi ${customer.name || 'Customer'},\n\nThank you for your order! Your order has been received and is being processed.\n\nOrder Number: ${order.orderNumber}\nOrder Date: ${new Date(order.createdAt).toLocaleDateString()}\nTotal: PKR ${order.finalTotal?.toLocaleString() || '0'}\n\nWe'll send you another email when your order ships.\n\nBest regards,\nGTA Auto Team`;

      const result = await sendEmail({
        to: order.shippingAddress.email,
        subject: `Order Confirmation #${order.orderNumber} - Garage Tuned Autos`,
        html,
        text
      });

      return result;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send admin notification email
   * @param {Object} order - Order data
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>}
   */
  async sendAdminNotificationEmail(order, customer) {
    try {
      const html = emailTemplates.adminNotification(order, customer);
      const text = `New Order Alert #${order.orderNumber}\n\nA new order has been received and requires immediate attention.\n\nOrder Number: ${order.orderNumber}\nCustomer: ${customer.name || 'N/A'}\nEmail: ${order.shippingAddress.email}\nTotal: PKR ${order.finalTotal?.toLocaleString() || '0'}\n\nPlease process this order as soon as possible.\n\nGTA Auto Admin System`;

      const result = await sendEmail({
        to: emailConfig.adminEmails,
        subject: `🚨 New Order Alert #${order.orderNumber} - Garage Tuned Autos`,
        html,
        text
      });

      return result;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      throw error;
    }
  }

  /**
   * Send order status update email
   * @param {Object} order - Order data
   * @param {string} newStatus - New order status
   * @param {string} note - Optional note
   * @returns {Promise<Object>}
   */
  async sendOrderStatusUpdateEmail(order, newStatus, note = '') {
    try {
      if (!order?.shippingAddress?.email) {
        throw new Error('Customer email is required');
      }

      const html = emailTemplates.orderStatusUpdate(order, newStatus, note);
      const text = `Order Status Update #${order.orderNumber}\n\nHi ${order.shippingAddress.firstName || 'Customer'},\n\nYour order status has been updated!\n\nOrder Number: ${order.orderNumber}\nNew Status: ${newStatus}\n${note ? `Note: ${note}` : ''}\n\nWe'll continue to keep you updated on your order progress.\n\nBest regards,\nGTA Auto Team`;

      const result = await sendEmail({
        to: order.shippingAddress.email,
        subject: `Order Status Update #${order.orderNumber} - Garage Tuned Autos`,
        html,
        text
      });

      return result;
    } catch (error) {
      console.error('Error sending order status update email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new customer
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>}
   */
  async sendWelcomeEmail(customer) {
    try {
      if (!customer?.email) {
        throw new Error('Customer email is required');
      }

      const html = emailTemplates.welcome(customer);
      const text = `Welcome to Garage Tuned Autos!\n\nHi ${customer.name || 'Customer'},\n\nWelcome to Garage Tuned Autos! We're excited to have you as part of our community.\n\nYou can now:\n- Browse our extensive catalog of automotive products\n- Track your orders in real-time\n- Manage your account and preferences\n- Get exclusive deals and offers\n\nGet started by visiting our dashboard.\n\nBest regards,\nGTA Auto Team`;

      const result = await sendEmail({
        to: customer.email,
        subject: 'Welcome to Garage Tuned Autos!',
        html,
        text
      });

      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send custom email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - HTML content
   * @param {string} text - Text content
   * @param {Array} attachments - Optional attachments
   * @returns {Promise<Object>}
   */
  async sendCustomEmail(to, subject, html, text, attachments = []) {
    try {
      const result = await sendEmail({
        to,
        subject,
        html,
        text,
        attachments
      });

      return result;
    } catch (error) {
      console.error('Error sending custom email:', error);
      throw error;
    }
  }

  /**
   * Send bulk emails
   * @param {Array} recipients - Array of recipient objects {email, name, data}
   * @param {string} templateType - Template type (welcome, orderConfirmation, etc.)
   * @param {Object} templateData - Additional template data
   * @returns {Promise<Array>}
   */
  async sendBulkEmails(recipients, templateType, templateData = {}) {
    try {
      const results = [];
      
      for (const recipient of recipients) {
        try {
          let html, text, subject;
          
          switch (templateType) {
            case 'welcome':
              html = emailTemplates.welcome(recipient);
              subject = 'Welcome to Garage Tuned Autos!';
              break;
            case 'orderConfirmation':
              html = emailTemplates.orderConfirmation(templateData.order, recipient);
              subject = `Order Confirmation #${templateData.order.orderNumber} - Garage Tuned Autos`;
              break;
            default:
              throw new Error(`Unknown template type: ${templateType}`);
          }

          const result = await sendEmail({
            to: recipient.email,
            subject,
            html,
            text
          });

          results.push({ recipient: recipient.email, success: true, result });
        } catch (error) {
          results.push({ recipient: recipient.email, success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      throw error;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();
export default emailService;
