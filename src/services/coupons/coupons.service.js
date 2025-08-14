import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * CouponService handles API calls for coupon management.
 *
 * Endpoints:
 * - GET /api/coupons
 * - POST /api/coupons
 * - POST /api/coupons/validate
 * - PUT /api/coupons/:id
 * - DELETE /api/coupons/:id
 */
class CouponService {
  /**
   * Get all coupons, optionally filtered by page, limit, active, expired.
   * @param {Object} params - Optional query params: { page, limit, active, expired }
   * @returns {Promise}
   */
  getAll = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.coupon.getAll, {
        params,
      });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Create a new coupon.
   * @param {Object} data - Coupon data: { code, discountType, discountValue, minAmount, expiresAt, usageLimit }
   * @returns {Promise}
   */
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.coupon.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Validate a coupon.
   * @param {Object} data - Validation data: { code, amount, products, categories }
   * @returns {Promise}
   */
  validate = async (data) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.coupon.validate,
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Update an existing coupon.
   * @param {string} id - Coupon ID
   * @param {Object} data - Updated coupon data
   * @returns {Promise}
   */
  update = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.coupon.update(id), data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Delete a coupon.
   * @param {string} id - Coupon ID
   * @returns {Promise}
   */
  delete = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.coupon.delete(id));
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new CouponService();
export default instance;
