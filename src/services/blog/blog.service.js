import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class BlogService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.blog.getAll);

      // Ensure we always return a proper response structure
      if (!res || typeof res !== "object") {
        return { data: { data: [] } };
      }

      // Normalize the response structure
      if (res.data && Array.isArray(res.data)) {
        return { data: { data: res.data } };
      }
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        return res;
      }
      return { data: { data: [] } };
    } catch (ex) {
      return { data: { data: [] } };
    }
  };

  getById = async (id) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.blog.getById(id));

      // Ensure we always return a proper response structure
      if (!res || typeof res !== "object") {
        return { data: { data: null } };
      }

      // Normalize the response structure
      if (res.data && !res.data.data) {
        return { data: { data: res.data } };
      }
      if (res.data && res.data.data) {
        return res;
      }
      return { data: { data: null } };
    } catch (ex) {
      return { data: { data: null } };
    }
  };

  // Admin Routes
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.blog.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (data) => {
    try {
      const { id, ...blogData } = data;
      
      if (!id) {
        throw new Error("Blog ID is required for update operation");
      }
      
      const requestData = {
        blogID: id, // Backend expects blogID, not id
        ...blogData,
      };
      
      const res = await gtaAutosInstance.put(API_URLS.blog.update, requestData);
      return res;
    } catch (ex) {
      const errorMessage = ex.response?.data?.message || ex.message || "Update failed";
      const error = new Error(errorMessage);
      error.response = ex.response;
      error.status = ex.response?.status;
      throw error;
    }
  };

  delete = async (data) => {
    try {
      const { id, ...otherData } = data;
      const requestData = {
        blogID: id, // Backend expects blogID, not id
        ...otherData,
      };

      const res = await gtaAutosInstance.delete(API_URLS.blog.delete, {
        data: requestData,
      });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Image upload for blog posts
  uploadImage = async (formData) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.blog.uploadImage,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (ex) {
      const errorMessage = ex.response?.data?.message || ex.message || "Failed to upload blog image";
      const error = new Error(errorMessage);
      error.response = ex.response;
      error.status = ex.response?.status;
      throw error;
    }
  };
}

const instance = new BlogService();
export default instance;
