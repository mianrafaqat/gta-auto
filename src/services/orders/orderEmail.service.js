/**
 * OrderEmailService handles sending order-related emails using local API endpoints
 * This service integrates with the Next.js API routes for email functionality
 */
class OrderEmailService {
  /**
   * Send order confirmation email to customer
   * @param {Object} order - Order data
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>}
   */
  async sendOrderConfirmationEmail(order, customer) {
    try {
      const response = await fetch('/api/orders/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order, customer }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send order confirmation email');
      }

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
      const response = await fetch('/api/orders/send-admin-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order, customer }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send admin notification email');
      }

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
      const response = await fetch('/api/orders/send-status-update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order, newStatus, note }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send order status update email');
      }

      return result;
    } catch (error) {
      console.error('Error sending order status update email:', error);
      throw error;
    }
  }

  /**
   * Resend order confirmation email (for cases where automatic email failed)
   * @param {string} orderId - Order ID
   * @param {Object} order - Order data
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>}
   */
  async resendOrderConfirmationEmail(orderId, order, customer) {
    try {
      const response = await fetch(`/api/orders/${orderId}/resend-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order, customer }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend order confirmation email');
      }

      return result;
    } catch (error) {
      console.error('Error resending order confirmation email:', error);
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
      const response = await fetch('/api/email/send-welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send welcome email');
      }

      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Verify email configuration
   * @returns {Promise<Object>}
   */
  async verifyEmailConfig() {
    try {
      const response = await fetch('/api/email/verify-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify email configuration');
      }

      return result;
    } catch (error) {
      console.error('Error verifying email configuration:', error);
      throw error;
    }
  }
}

const instance = new OrderEmailService();
export default instance;
