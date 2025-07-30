import { ENV } from "src/config/app";

export const API_URLS = {
  auth: {
    fetchToken: ({ userId }) => "/login/fetchToken?userId=" + userId,
    forgotPassword: "/api/user/reset-password",
    updatePassword: ({ userId, token }) =>
      `/api/user/update-password/${userId}/${token}`,
  },
  cars: {
    getAll: "/api/car/getAll",
    getDetailsByRegNo: "/api/car/getByRegNo",
    imagesUpload: "/api/car/uploadCarImages",
    addCar: "/api/car/addCar",
    addCar: "/api/car/add",
    deleteCar: "/api/car/delete",
    updateCar: "/api/car/update",
    getById: "/api/car/getById",
    getCarModels: "/api/car/getCarModelsByCar",
    getCarModelsByYear: "/api/car/getCarModelsByYear",
    getCarsMakesList: "/api/car/carsList",
    filterByModalAndMake: "/api/car/filterByMakeAndModel",
    getCarBodyList: "/api/car/carsBodyList",
    addOrRemoveFav: "/api/user/addOrRemoveFavourite",
    getUserFavouriteById: "/api/user/getUserFavouriteCars",
    getCarDealsList: "/api/car/getCarDealOptions",
    sendEmailToCarOwner: "/api/car/sendEmailToCarOwner",
  },
  user: {
    editProfile: "/api/user/update",
    getAll: "/api/user/getAll",
  },
  admin: {
    banUser: "/api/user/update",
    editProfile: "/api/admin/update",
  },
  video: {
    add: "/api/video/add",
    getAll: "/api/video/getAll",
    getById: "/api/video/getById",
    update: "/api/video/update",
    delete: "/api/video/delete",
    getMyVideos: "/api/video/getMyVideos",
  },
};
