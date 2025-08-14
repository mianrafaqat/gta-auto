import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * TaxService handles API calls for tax rules.
 *
 * Endpoints:
 * - GET /api/tax?country=XX&state=YY
 * - POST /api/tax
 * - PUT /api/tax/:id
 * - DELETE /api/tax/:id
 */
class TaxService {
  /**
   * Get all tax rules, optionally filtered by country and/or state.
   * @param {Object} params - Optional query params: { country, state }
   * @returns {Promise}
   */
  getAll = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.tax.getAll, { params });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Create a new tax rule.
   * @param {Object} data - Tax rule data: { name, country, rate, isDefault }
   * @returns {Promise}
   */
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.tax.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Update an existing tax rule.
   * @param {string} id - Tax rule ID
   * @param {Object} data - Updated tax rule data
   * @returns {Promise}
   */
  update = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.tax.update(id), data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Delete a tax rule.
   * @param {string} id - Tax rule ID
   * @returns {Promise}
   */
  delete = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.tax.delete(id));
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Calculate tax for a given amount and location.
   * @param {Object} data - { amount: number, country: string, state?: string, includesTax: boolean }
   * @returns {Promise}
   */
  calculate = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.tax.calculate, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

export default new TaxService();
