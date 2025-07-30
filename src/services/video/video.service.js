import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class VideoService {
  addVideo = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.video.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getAllVideos = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.video.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getMyVideos = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.video.getMyVideos);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  deleteVideo = async (data) => {
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