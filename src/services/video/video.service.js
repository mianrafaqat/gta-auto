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

  getVideoById = async (videoID) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.video.getById, { videoID });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  updateVideo = async (data) => {
    try {
      console.log('Video service update data:', data); // Debug log
      const res = await gtaAutosInstance.put(API_URLS.video.update, data);
      return res;
    } catch (ex) {
      console.error('Video service update error:', ex); // Debug log
      throw ex;
    }
  };
}

const instance = new VideoService();
export default instance; 