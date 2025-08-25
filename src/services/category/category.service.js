import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class CategoryService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.category.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getById = async (id) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.category.getById(id));
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Get category tree structure
  getTree = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.category.getTree);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Admin Routes
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.category.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.category.update(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  delete = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.category.delete(id));
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new CategoryService();
export default instance;
