import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class BlogService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.blog.getAll);
      return res;
    } catch (ex) {
      throw ex;
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
      const res = await gtaAutosInstance.put(API_URLS.blog.update, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  delete = async (data) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.blog.delete, { data });
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new BlogService();
export default instance;