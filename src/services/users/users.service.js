import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

class UserService {
  // Public Routes
  register = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.auth.register, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  verifyEmail = async (id, token) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.auth.verify(id, token));
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  login = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.auth.login, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  forgotPassword = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.auth.forgotPassword, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  updatePassword = async (data) => {
    try {
      const params = {
        userId: data.userId,
        token: data.token,
      };
      const res = await gtaAutosInstance.post(API_URLS.auth.updatePassword(params), data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Protected Routes
  getCurrentUser = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.user.me);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  updateProfile = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.user.update, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  addOrRemoveFavorite = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.user.addOrRemoveFavorite, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getUserFavorites = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.user.getUserFavorites, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Admin Routes
  getAllUsers = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.user.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  deleteUser = async (data) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.user.delete, { data });
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new UserService();
export default instance;
