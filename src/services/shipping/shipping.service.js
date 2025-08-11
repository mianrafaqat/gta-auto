import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class ShippingService {
  // Get all shipping methods
  async getAllMethods() {
    try {
      const response = await gtaAutosInstance.get(API_URLS.shipping.root);
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // Get shipping method by ID
  async getMethodById(id) {
    try {
      const response = await gtaAutosInstance.get(
        `${API_URLS.shipping.root}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // Create new shipping method (Protected - Admin only)
  async createMethod(data) {
    try {
      const response = await gtaAutosInstance.post(
        API_URLS.shipping.root,
        data
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // Update shipping method (Protected - Admin only)
  async updateMethod(id, data) {
    try {
      const response = await gtaAutosInstance.put(
        `${API_URLS.shipping.root}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // Delete shipping method (Protected - Admin only)
  async deleteMethod(id) {
    try {
      const response = await gtaAutosInstance.delete(
        `${API_URLS.shipping.root}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // Calculate shipping cost
  async calculateShipping(data) {
    try {
      const response = await gtaAutosInstance.post(
        API_URLS.shipping.calculate,
        data
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // Get available shipping methods
  async getAvailableMethods(data) {
    try {
      const response = await gtaAutosInstance.post(
        API_URLS.shipping.getAvailableMethods,
        data
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

export default new ShippingService();
