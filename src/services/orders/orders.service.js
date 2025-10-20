import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * OrderService handles API calls for orders.
 *
 * Endpoints:
 * - POST /api/orders (Create Order)
 * - GET /api/orders (Get My Orders)
 * - GET /api/orders/user/:userId (Get Orders by User ID - Non-Admin)
 * - GET /api/orders/all (Get All Orders - Admin)
 * - GET /api/orders/:id (Get Order by ID)
 * - PUT /api/orders/:id/status (Update Order Status - Admin)
 * - POST /api/orders/:id/tracking (Add Tracking Information - Admin)
 * - DELETE /api/orders/:id (Delete Order - Admin)
 */
class OrderService {
  
  /**
   * Helper method to check if user is admin
   * @returns {boolean}
   */
  _isAdmin() {
    try {
      // Get user data from localStorage (same as auth context does)
      const userStr = localStorage.getItem('USER_DETAILS');
      if (!userStr) return false;
      
      const userData = JSON.parse(userStr);
      return userData?.role === 'admin' || userData?.role === 'superadmin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Helper method to get current user ID
   * @returns {string|null}
   */
  _getCurrentUserId() {
    try {
      const userStr = localStorage.getItem('USER_DETAILS');
      if (!userStr) return null;
      
      const userData = JSON.parse(userStr);
      return userData?._id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }
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
   * Get orders based on user role.
   * - Admin/SuperAdmin: Get all orders from all users
   * - Regular User: Get orders for the current user only
   * @param {Object} params - Optional query params
   * @returns {Promise<{orders: Array, pagination: Object}>}
   */
  async getAll(params = {}) {
    try {
      let endpoint;
    
  
        endpoint = API_URLS.orders.getAll;

      const res = await gtaAutosInstance.get(endpoint, {
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
      const res = await gtaAutosInstance.get(API_URLS.orders.getMyOrders, {
        params,
      });
      
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Get orders by specific user ID (admin only).
   * @param {string} userId - User ID
   * @param {Object} params - Optional query params
   * @returns {Promise<{orders: Array, pagination: Object}>}
   */
  async getOrdersByUserId(userId, params = {}) {
    try {
      if (!this._isAdmin()) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      const res = await gtaAutosInstance.get(API_URLS.orders.getByUserId(userId), {
        params,
      });
      
      return res.data;
    } catch (ex) {
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
    
      
      const res = await gtaAutosInstance.get(API_URLS.orders.getById(id));
      
      return res.data;
    } catch (ex) {
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

  /**
   * Delete an order (admin only).
   * @param {string} id - Order ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.orders.delete(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  }
}

const instance = new OrderService();
export default instance;
