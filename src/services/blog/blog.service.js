import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class BlogService {
  // Public Routes
  getAll = async () => {
    try {
      console.log("🔍 BlogService.getAll: Starting...");
      console.log(
        "🔍 BlogService.getAll: API_URLS.blog.getAll:",
        API_URLS.blog.getAll
      );
      console.log("🔍 BlogService.getAll: URL:", API_URLS.blog.getAll);
      console.log(
        "🔍 BlogService.getAll: Base URL:",
        gtaAutosInstance.defaults.baseURL
      );

      const res = await gtaAutosInstance.get(API_URLS.blog.getAll);
      console.log("BlogService.getAll response:", res);

      // Ensure we always return a proper response structure
      if (!res || typeof res !== "object") {
        console.warn("BlogService.getAll: Invalid response structure:", res);
        return { data: { data: [] } };
      }

      // Normalize the response structure
      if (res.data && Array.isArray(res.data)) {
        // If data is directly an array, wrap it in the expected structure
        return { data: { data: res.data } };
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // If data.data is an array, return as is
        return res;
      } else {
        console.warn(
          "BlogService.getAll: Unexpected data structure:",
          res.data
        );
        return { data: { data: [] } };
      }
    } catch (ex) {
      console.error("BlogService.getAll error:", ex);
      // Return a safe default response structure
      return { data: { data: [] } };
    }
  };

  getById = async (id) => {
    try {
      console.log("🔍 BlogService.getById: Starting...");
      console.log("🔍 BlogService.getById: ID:", id);
      console.log("🔍 BlogService.getById: URL:", API_URLS.blog.getById(id));

      const res = await gtaAutosInstance.get(API_URLS.blog.getById(id));
      console.log("BlogService.getById response:", res);

      // Ensure we always return a proper response structure
      if (!res || typeof res !== "object") {
        console.warn("BlogService.getById: Invalid response structure:", res);
        return { data: { data: null } };
      }

      // Normalize the response structure
      if (res.data && !res.data.data) {
        // If data exists but doesn't have nested data, wrap it
        return { data: { data: res.data } };
      } else if (res.data && res.data.data) {
        // If data.data exists, return as is
        return res;
      } else {
        console.warn(
          "BlogService.getById: Unexpected data structure:",
          res.data
        );
        return { data: { data: null } };
      }
    } catch (ex) {
      console.error("BlogService.getById error:", ex);
      // Return a safe default response structure
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
      // Transform the data to match backend expectations
      const { id, ...blogData } = data;
      const requestData = {
        blogID: id, // Backend expects blogID, not id
        ...blogData,
      };

      console.log("🔍 BlogService.update: Request data:", requestData);
      const res = await gtaAutosInstance.put(API_URLS.blog.update, requestData);
      console.log("🔍 BlogService.update: Response:", res);
      return res;
    } catch (ex) {
      console.error("🔍 BlogService.update: Error:", ex);
      throw ex;
    }
  };

  delete = async (data) => {
    try {
      // Transform the data to match backend expectations
      const { id, ...otherData } = data;
      const requestData = {
        blogID: id, // Backend expects blogID, not id
        ...otherData,
      };

      console.log("🔍 BlogService.delete: Request data:", requestData);
      const res = await gtaAutosInstance.delete(API_URLS.blog.delete, {
        data: requestData,
      });
      console.log("🔍 BlogService.delete: Response:", res);
      return res;
    } catch (ex) {
      console.error("🔍 BlogService.delete: Error:", ex);
      throw ex;
    }
  };
}

const instance = new BlogService();
export default instance;
