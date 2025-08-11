import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * OrderService handles API calls for orders.
 *
 * Endpoints:
 * - POST /api/orders (Create Order)
 * - GET /api/orders (Get My Orders)
 * - GET /api/orders/all (Get All Orders - Admin)
 * - GET /api/orders/:id (Get Order by ID)
 * - PUT /api/orders/:id/status (Update Order Status - Admin)
 */
class OrderService {
  /**
   * Create a new order.
   * @param {Object} data - Order data (see API docs for structure)
   * @returns {Promise<Object>}
   */
  create = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.orders.create, data);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get current user's orders (with optional query params: page, limit, status).
   * @param {Object} params - Optional query params
   * @returns {Promise<{orders: Array, pagination: Object}>}
   */
  getMyOrders = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.orders.getMyOrders, {
        params,
      });
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get all orders (admin only).
   * @param {Object} params - Optional query params
   * @returns {Promise<{orders: Array, pagination: Object}>}
   */
  getAll = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.orders.getAll, {
        params,
      });
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get an order by its ID.
   * @param {string} id - Order ID
   * @returns {Promise<Object>}
   */
  getById = async (id) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.orders.getById(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Update order status (admin only).
   * @param {string} id - Order ID
   * @param {Object} data - { status: string, note?: string }
   * @returns {Promise<Object>}
   */
  updateStatus = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.orders.updateStatus(id),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new OrderService();
export default instance;
