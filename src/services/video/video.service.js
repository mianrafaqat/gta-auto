import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class VideoService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.video.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getById = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.video.getById, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getByCategory = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.video.getByCategory, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getByOwner = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.video.getByOwner, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Admin Routes
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.video.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.video.update, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  delete = async (data) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.video.delete, { data });
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new VideoService();
export default instance; 