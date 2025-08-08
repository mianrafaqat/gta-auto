import { ENV } from "src/config/app";

export const API_URLS = {
  auth: {
    // Public Routes
    register: "/api/user/register",
    verify: (id, token) => `/api/user/verify/${id}/${token}`,
    login: "/api/user/login",
    refreshToken: "/api/user/refresh-token",
    forgotPassword: "/api/user/reset-password",
    updatePassword: ({ userId, token }) =>
      `/api/user/update-password/${userId}/${token}`,
  },
  user: {
    // Protected Routes
    me: "/api/user/me",
    update: "/api/user/update",
    addOrRemoveFavorite: "/api/user/addOrRemoveFavourite",
    getUserFavorites: "/api/user/getUserFavouriteCars",

    // Admin Routes
    registerUser: "/api/user/register", // Admin token required
    getAll: "/api/user/getAll",

    // Superadmin Routes
    registerAdmin: "/api/user/register-admin",
    delete: "/api/user/delete",
  },
  products: {
    // Public Routes
    getAll: "/api/products",
    getById: (id) => `/api/products/${id}`,
    getBySlug: (slug) => `/api/products/slug/${slug}`,

    // Protected Routes
    create: "/api/products",
    update: (id) => `/api/products/${id}`,
    delete: (id) => `/api/products/${id}`,
    uploadImages: "/api/products/upload-images",
  },
  cars: {
    // Public Routes
    getAll: "/api/car/getAll",
    getById: "/api/car/getById",
    getByRegNo: "/api/car/getByRegNo",
    carsList: "/api/car/carsList",
    carsBodyList: "/api/car/carsBodyList",
    getCarModelsByCar: "/api/car/getCarModelsByCar",
    getCarModelsByYear: "/api/car/getCarModelsByYear",
    filterByMakeAndModel: "/api/car/filterByMakeAndModel",
    sendEmailToCarOwner: "/api/car/sendEmailToCarOwner",

    // Protected Routes
    getMyCars: "/api/car/my-cars",
    uploadCarImages: "/api/car/uploadCarImages",
    addOrRemoveFav: "/api/user/addOrRemoveFavourite",
    getUserFavouriteById: "/api/user/getUserFavouriteCars",

    // Admin Routes
    add: "/api/car/add",
    update: "/api/car/update",
    delete: "/api/car/delete",
  },
  blog: {
    // Public Routes
    getAll: "/api/blog/getAll",

    // Admin Routes
    add: "/api/blog/add",
    update: "/api/blog/update",
    delete: "/api/blog/delete",
  },
  video: {
    // Public Routes
    getAll: "/api/video/getAll",
    getById: "/api/video/getById",
    getByCategory: "/api/video/getByCategory",
    getByOwner: "/api/video/getByOwner",

    // Admin Routes
    add: "/api/video/add",
    update: "/api/video/update",
    delete: "/api/video/delete",
  },
  ads: {
    // Public Routes
    getAll: "/api/ads/getAll",

    // Admin Routes
    add: "/api/ads/add",
    update: "/api/ads/update",
    delete: "/api/ads/delete",
  },
};
