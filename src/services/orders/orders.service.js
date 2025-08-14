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
 * - POST /api/orders/:id/tracking (Add Tracking Information - Admin)
 */
class OrderService {
  /**
   * Create a new order.
   * @param {Object} data - Order data (see API docs for structure)
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const res = await gtaAutosInstance.post(API_URLS.orders.create, data);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Get all orders (admin only).
   * @param {Object} params - Optional query params
   * @returns {Promise<{orders: Array, pagination: Object}>}
   */
  async getAll(params = {}) {
    try {
      const res = await gtaAutosInstance.get(API_URLS.orders.getAll, {
        params,
      });
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Get current user's orders (with optional query params: page, limit, status).
   * @param {Object} params - Optional query params
   * @returns {Promise<{orders: Array, pagination: Object}>}
   */
  async getMyOrders(params = {}) {
    try {
      console.log("🔄 [SERVICE] OrdersService.getMyOrders: Starting...");
      console.log("🔄 [SERVICE] URL:", API_URLS.orders.getMyOrders);
      console.log("🔄 [SERVICE] Params:", params);
      
      const res = await gtaAutosInstance.get(API_URLS.orders.getMyOrders, {
        params,
      });
      
      console.log("✅ [SERVICE] getMyOrders success:", res.status, res.data);
      return res.data;
    } catch (ex) {
      console.log("❌ [SERVICE] getMyOrders error:", ex);
      throw ex;
    }
  }

  /**
   * Get an order by its ID.
   * @param {string} id - Order ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      console.log("🔄 [SERVICE] OrdersService.getById: Starting...");
      console.log("🔄 [SERVICE] Order ID:", id);
      console.log("🔄 [SERVICE] URL:", API_URLS.orders.getById(id));
      
      const res = await gtaAutosInstance.get(API_URLS.orders.getById(id));
      
      console.log("✅ [SERVICE] getById success:", res.status, res.data);
      return res.data;
    } catch (ex) {
      console.log("❌ [SERVICE] getById error:", ex);
      throw ex;
    }
  }

  /**
   * Update order status (admin only).
   * @param {string} id - Order ID
   * @param {Object} data - { status: string, note?: string }
   * @returns {Promise<Object>}
   */
  async updateStatus(id, data) {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.orders.updateStatus(id),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Add tracking information to an order (admin only).
   * @param {string} id - Order ID
   * @param {Object} data - { status: string, trackingNumber: string, carrier: string, note?: string, estimatedDelivery?: string }
   * @returns {Promise<Object>}
   */
  async addTracking(id, data) {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.orders.addTracking(id),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }
}

const instance = new OrderService();
export default instance;
