import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class AttributeService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.attribute.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Protected/Admin Routes
  add = async (data) => {
    try {
      // data should be in the format:
      // {
      //   name: "Size",
      //   type: "select",
      //   values: [{ name: "Small", slug: "small" }, ...]
      // }
      const res = await gtaAutosInstance.post(API_URLS.attribute.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.attribute.update(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  delete = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.attribute.delete(id));
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new AttributeService();
export default instance;
