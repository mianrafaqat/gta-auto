import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class CarsService {
  // Public Routes
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.cars.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getById = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.getById, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getByRegNo = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.getByRegNo, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarsList = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.cars.carsList);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarsBodyList = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.cars.carsBodyList);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarModelsByCar = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.getCarModelsByCar, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarModelsByYear = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.getCarModelsByYear, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  filterByMakeAndModel = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.filterByMakeAndModel, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  sendEmailToCarOwner = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.sendEmailToCarOwner, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Protected Routes
  getMyCars = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.cars.getMyCars);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  uploadCarImages = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((f) => {
        if (typeof f == "object") {
          formData.append("files", f);
        }
      });
      const res = await gtaAutosInstance.post(
        API_URLS.cars.uploadCarImages,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Admin Routes
  add = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.cars.add, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  update = async (data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.cars.update, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  delete = async (data) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.cars.delete, { data });
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new CarsService();
export default instance;