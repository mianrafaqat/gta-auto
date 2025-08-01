import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class AdminService {
  // Public Routes
  login = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.admin.login, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Admin Routes
  register = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.admin.register, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.admin.update, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getInfo = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.admin.get);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new AdminService();
export default instance;
