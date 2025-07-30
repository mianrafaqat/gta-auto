import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class AdminService {
  banOrPermitUser = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.admin.banUser, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  updateProfile = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.admin.editProfile, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  }
}


const instance = new AdminService();
export default instance;
