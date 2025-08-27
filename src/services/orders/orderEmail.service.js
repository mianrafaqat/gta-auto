import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * OrderEmailService handles sending order-related emails
 * Note: The backend automatically sends emails when orders are created
 * This service is for additional email operations if needed
 */
class OrderEmailService {
  /**
   * Send order confirmation email to customer
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>}
   */
  async sendOrderConfirmationEmail(orderData) {
    try {
      const res = await gtaAutosInstance.post(
        "/api/orders/send-confirmation-email",
        orderData
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Send admin notification email
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>}
   */
  async sendAdminNotificationEmail(orderData) {
    try {
      const res = await gtaAutosInstance.post(
        "/api/orders/send-admin-notification",
        orderData
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Send order status update email
   * @param {Object} orderData - Order data with status update
   * @returns {Promise<Object>}
   */
  async sendOrderStatusUpdateEmail(orderData) {
    try {
      const res = await gtaAutosInstance.post(
        "/api/orders/send-status-update-email",
        orderData
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Resend order confirmation email (for cases where automatic email failed)
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>}
   */
  async resendOrderConfirmationEmail(orderId) {
    try {
      const res = await gtaAutosInstance.post(
        `/api/orders/${orderId}/resend-confirmation`,
        {}
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }
}

const instance = new OrderEmailService();
export default instance;
