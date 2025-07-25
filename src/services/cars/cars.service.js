import { API_URLS } from "src/utils/apiUrls";
import cityAutosInstance from "src/utils/requestInterceptor";

class CarsService {
  getAll = async () => {
    try {
      const res = await cityAutosInstance.get(API_URLS.cars.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  getMyCars = async (userId) => {
    try {
      const res = await this.getAll();
      if (res?.data?.length) {
        const { data: totalCars } = res;
        const filterCars = totalCars.filter(
          (car) => car?.owner?._id === userId
        );
        return {
          data: filterCars,
        };
      } else {
        return {
          data: [],
        };
      }
    } catch (ex) {
      throw ex;
    }
  };
  getDetailsByRegNo = async (regNo) => {
    try {
      const data = {
        registrationNumber: regNo,
      };
      const res = await cityAutosInstance.post(
        API_URLS.cars.getDetailsByRegNo,
        data
      );
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
      const res = await cityAutosInstance.post(
        API_URLS.cars.imagesUpload,
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
  addNewCar = async (data) => {
    try {
      const res = await cityAutosInstance.post(API_URLS.cars.addCar, data);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  deleteCarById = async (data) => {
    try {
      const res = await cityAutosInstance.delete(API_URLS.cars.deleteCar, {
        data,
      });
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  updateCar = async (data) => {
    try {
      async function handleUpdateCar(updateData) {
        try {
          const res = await cityAutosInstance.put(
            API_URLS.cars.updateCar,
            updateData
          );
          return res;
        } catch (ex) {
          throw ex;
        }
      }

      let newImageAdded = data?.image?.some((img) => typeof img === "object");
      if (newImageAdded) {
        const uploadImageResponse = await this.uploadCarImages(data?.image);
        if (uploadImageResponse?.data?.imagesUrl) {
          let image = data?.image.filter((img) => typeof img === "string");
          image = [...image, ...uploadImageResponse?.data?.imagesUrl];
          data = {
            ...data,
            image,
          };
          return handleUpdateCar(data);
        } else {
          return {
            status: 400,
            data: "Something went wrong",
          };
        }
      } else {
        return handleUpdateCar(data);
      }
    } catch (ex) {
      throw ex;
    }
  };
  getCarById = async (carID) => {
    try {
      const res = await cityAutosInstance.post(API_URLS.cars.getById, {
        carID,
      });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarMakes = async () => {
    try {
      const res = await cityAutosInstance.get(API_URLS.cars.getCarsMakesList);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarModels = async ({ selectedCar }) => {
    try {
      const res = await cityAutosInstance.post(API_URLS.cars.getCarModels, {
        selectedCar,
      });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarModelsByYear = async ({ selectedCar, year }) => {
    try {
      year = year.toString();
      const res = await cityAutosInstance.post(
        API_URLS.cars.getCarModelsByYear,
        { selectedCar, year }
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  filterByMakeAndModel = async ({ make, model }) => {
    try {
      const res = await cityAutosInstance.post(
        API_URLS.cars.filterByModalAndMake,
        { make, model }
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarBodyList = async () => {
    try {
      const res = await cityAutosInstance.get(API_URLS.cars.getCarBodyList);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
  addOrRemoveFavouriteCar = async (data) => {
    try {
      const res = await cityAutosInstance.post(
        API_URLS.cars.addOrRemoveFav,
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getUserFavouriteCar = async (data) => {
    try {
      const res = await cityAutosInstance.post(
        API_URLS.cars.getUserFavouriteById,
        data
      );

      return res;
    } catch (ex) {
      throw ex;
    }
  };

  sendEmail = async (data) => {
    try {
      const res = await cityAutosInstance.post(
        API_URLS.cars.sendEmailToCarOwner,
        data
      );

      return res;
    } catch (ex) {
      throw ex;
    }
  };

  getCarDealOptions = async () => {
    try {
      const res = await cityAutosInstance.get(API_URLS.cars.getCarDealsList);
      return res;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new CarsService();
export default instance;
