import { API_URLS } from "src/utils/apiUrls";
import { ACCESS_TOKEN_KEY } from "src/utils/constants";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * ProductService handles API calls for products.
 *
 * Endpoints:
 * - GET /api/products
 * - GET /api/products/:id
 * - GET /api/products/slug/:slug
 * - POST /api/products
 * - PUT /api/products/:id
 * - DELETE /api/products/:id
 * - GET /api/products/:id/variations
 * - POST /api/products/:id/variations
 * - PUT /api/products/:id/variations/:variationId
 * - DELETE /api/products/:id/variations/:variationId
 */
class ProductService {
  /**
   * Get all products with optional query params (pagination, filters, etc).
   * @param {Object} params - Optional query params: { page, limit, ... }
   * @returns {Promise<{products: Array, pagination: Object}>}
   */
  getAll = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.products.getAll, {
        params,
      });
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get a product by its ID.
   * @param {string} id - Product ID
   * @returns {Promise<Object>}
   */
  getById = async (id) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.products.getById(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get a product by its slug.
   * @param {string} slug - Product slug
   * @returns {Promise<Object>}
   */
  getBySlug = async (slug) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.products.getBySlug(slug));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Create a new product.
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  create = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.products.create, data);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Update an existing product.
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<Object>}
   */
  update = async (id, data) => {
    try {
      // Format the update data to match the new API structure
      const formattedData = {
        ...data,
        // Ensure images is an array
        images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
        // Ensure categories is an array of IDs
        categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
        // Ensure numeric fields are properly formatted
        price: data.price ? Number(data.price) : undefined,
        regularPrice: data.regularPrice ? Number(data.regularPrice) : undefined,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        stockQuantity: data.stockQuantity ? Number(data.stockQuantity) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        // Ensure dimensions object is properly formatted
        dimensions: data.dimensions ? {
          length: data.dimensions.length ? Number(data.dimensions.length) : undefined,
          width: data.dimensions.width ? Number(data.dimensions.width) : undefined,
          height: data.dimensions.height ? Number(data.dimensions.height) : undefined,
        } : undefined,
      };

      // Remove undefined values to keep the payload clean
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined) {
          delete formattedData[key];
        }
      });

      const res = await gtaAutosInstance.put(
        API_URLS.products.update(id),
        formattedData
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Delete a product.
   * @param {string} id - Product ID
   * @returns {Promise<Object>}
   */
  delete = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.products.delete(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get variations for a variable product.
   * @param {string} id - Product ID
   * @returns {Promise<Array>}
   */
  getVariations = async (id) => {
    try {
      const res = await gtaAutosInstance.get(
        API_URLS.products.getVariations(id)
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Create a variation for a variable product.
   * @param {string} id - Product ID
   * @param {Object} data - Variation data
   * @returns {Promise<Object>}
   */
  createVariation = async (id, data) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.products.createVariation(id),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Update a variation for a variable product.
   * @param {string} id - Product ID
   * @param {string} variationId - Variation ID
   * @param {Object} data - Updated variation data
   * @returns {Promise<Object>}
   */
  updateVariation = async (id, variationId, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.products.updateVariation(id, variationId),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Delete a variation for a variable product.
   * @param {string} id - Product ID
   * @param {string} variationId - Variation ID
   * @returns {Promise<Object>}
   */
  deleteVariation = async (id, variationId) => {
    try {
      const res = await gtaAutosInstance.delete(
        API_URLS.products.deleteVariation(id, variationId)
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Upload product image(s).
   * @param {FormData} formData - Multipart form data with image file(s)
   * @returns {Promise<Object>}
   */
  uploadImage = async (formData) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.products.uploadImages,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new ProductService();
export default instance;
