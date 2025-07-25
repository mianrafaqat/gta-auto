import { API_URLS } from 'src/utils/apiUrls';
import cityAutosInstance from 'src/utils/requestInterceptor';

class UserService {
  forgotPassword = async (data) => {
    try {
      const res = await cityAutosInstance.post(API_URLS.auth.forgotPassword, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  updatePassword = async (data) => {
    try {
      const params = {
        token: data.token,
        userId: data.userId,
      };
      const res = await cityAutosInstance.post(API_URLS.auth.updatePassword(params), data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  editProfile = async (data) => {
    try {
      const res = await cityAutosInstance.put(API_URLS.user.editProfile, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  getAllUsers = async () => {
    try {
      const res = await cityAutosInstance.get(API_URLS.user.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new UserService();
export default instance;
