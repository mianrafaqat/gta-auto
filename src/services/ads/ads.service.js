import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class AdsService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.ads.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Admin Routes
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.ads.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.ads.update, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  delete = async (data) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.ads.delete, { data });
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new AdsService();
export default instance;