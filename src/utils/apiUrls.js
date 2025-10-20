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
    addOrRemoveFavoriteProduct: "/api/user/addOrRemoveFavouriteProduct",
    getUserFavoriteProducts: "/api/user/getUserFavouriteProducts",

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

    // Product Variations
    getVariations: (id) => `/api/products/${id}/variations`, // GET: Get Product Variations
    createVariation: (id) => `/api/products/${id}/variations`, // POST: Create Variation (Protected)
    updateVariation: (id, variationId) =>
      `/api/products/${id}/variations/${variationId}`, // PUT: Update Variation (Protected)
    deleteVariation: (id, variationId) =>
      `/api/products/${id}/variations/${variationId}`, // DELETE: Delete Variation

    // Protected Routes
    create: "/api/products",
    update: (id) => `/api/products/${id}`,
    delete: (id) => `/api/products/${id}`,
    uploadImages: "/api/products/upload-image", // Updated to match API docs
  },

  shipping: {
    root: "/api/shipping",
    calculate: "/api/shipping/calculate",
    getAvailableMethods: "/api/shipping/available",
    getById: (id) => `/api/shipping/${id}`,
    update: (id) => `/api/shipping/${id}`,
    delete: (id) => `/api/shipping/${id}`,
  },

  orders: {
    // User (Protected) Routes
    create: "/api/orders", // POST: Create Order
    getMyOrders: "/api/orders", // GET: Get My Orders (with optional query params)
    getById: (id) => `/api/orders/${id}`, // GET: Get Order by ID
    getByUserId: (userId) => `/api/orders/user/${userId}`, // GET: Get orders by user ID

    // Admin Routes
    getAll: "/api/orders/all", // GET: Get All Orders (Admin only) - Updated to match API docs
    updateStatus: (id) => `/api/orders/${id}/status`, // PUT: Update Order Status (Admin only)
    addTracking: (id) => `/api/orders/${id}/tracking`, // POST: Add Tracking Information (Admin only)
    delete: (id) => `/api/orders/${id}`, // DELETE: Delete Order (Admin only)

    // Email Routes
    sendConfirmationEmail: "/api/orders/send-confirmation-email", // POST: Send order confirmation email
    sendAdminNotification: "/api/orders/send-admin-notification", // POST: Send admin notification email
    sendStatusUpdateEmail: "/api/orders/send-status-update-email", // POST: Send order status update email
    resendConfirmation: (id) => `/api/orders/${id}/resend-confirmation`, // POST: Resend order confirmation email
  },

  email: {
    // Email Management Routes
    sendWelcome: "/api/email/send-welcome", // POST: Send welcome email
    verifyConfig: "/api/email/verify-config", // GET: Verify email configuration
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
    getAll: "/api/blogs/getAll",
    getById: (id) => `/api/blogs/get/${id}`, // Matches: router.get("/get/:id", ...)
    // Admin Routes
    add: "/api/blogs/add",
    update: "/api/blogs/update",
    delete: "/api/blogs/delete",
    uploadImage: "/api/blogs/upload-image", // Image uploader for blog images
  },
  blogComment: {
    // Public Routes
    getByBlog: (blogId) => `/api/blog-comments/blog/${blogId}`,
    getById: (commentId) => `/api/blog-comments/${commentId}`,
    getAll: "/api/blog-comments",

    // Protected Routes
    create: "/api/blog-comments",
    update: (commentId) => `/api/blog-comments/${commentId}`,
    delete: (commentId) => `/api/blog-comments/${commentId}`,
    getAdminAll: "/api/blog-comments/admin/all",
    getAdminStats: "/api/blog-comments/admin/stats",
    moderate: (commentId) => `/api/blog-comments/admin/${commentId}/moderate`,
    bulkModerate: "/api/blog-comments/admin/bulk-moderate",
  },
  forum: {
    // Forum Categories Routes
    categories: {
      getAll: "/api/forum/categories",
      create: "/api/forum/categories",
      update: (id) => `/api/forum/categories/${id}`,
      delete: (id) => `/api/forum/categories/${id}`,
    },

    // Forum Topics Routes
    topics: {
      getAll: "/api/forum/topics",
      getById: (id) => `/api/forum/topics/${id}`,
      create: "/api/forum/topics",
      update: (id) => `/api/forum/topics/${id}`,
      delete: (id) => `/api/forum/topics/${id}`,
      toggleLike: (id) => `/api/forum/topics/${id}/like`,
      togglePin: (id) => `/api/forum/topics/${id}/pin`,
      toggleLock: (id) => `/api/forum/topics/${id}/lock`,
    },

    // Forum Comments Routes
    comments: {
      getByTopic: (topicId) => `/api/forum/topics/${topicId}/comments`,
      create: (topicId) => `/api/forum/topics/${topicId}/comments`,
      update: (id) => `/api/forum/comments/${id}`,
      delete: (id) => `/api/forum/comments/${id}`,
      toggleLike: (id) => `/api/forum/comments/${id}/like`,
    },

    // Forum Replies Routes
    replies: {
      getByComment: (commentId) => `/api/forum/comments/${commentId}/replies`,
      create: (commentId) => `/api/forum/comments/${commentId}/replies`,
      update: (id) => `/api/forum/replies/${id}`,
      delete: (id) => `/api/forum/replies/${id}`,
      toggleLike: (id) => `/api/forum/replies/${id}/like`,
    },

    // Forum Search and Statistics Routes
    search: "/api/forum/search",
    stats: "/api/forum/stats",

    // Image upload for forum
    uploadImage: "/api/forum/upload-image", // Image uploader for forum images
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
  category: {
    getAll: "/api/categories", // Updated to match API docs
    getById: (id) => `/api/categories/${id}`,
    getTree: "/api/categories/tree", // Added tree endpoint
    add: "/api/categories",
    delete: (id) => `/api/categories/${id}`,
    update: (id) => `/api/categories/${id}`,
  },
  attribute: {
    getAll: "/api/categories/attributes", // Updated to match API docs
    add: "/api/categories/attributes",
    delete: (id) => `/api/categories/attributes/${id}`, // Updated to match API docs
    update: (id) => `/api/categories/attributes/${id}`, // Updated to match API docs
  },
  tax: {
    getAll: "/api/tax",
    add: "/api/tax",
    delete: (id) => `/api/tax/${id}`,
    update: (id) => `/api/tax/${id}`,
    calculate: "/api/tax/calculate", // Added calculate endpoint
  },
  coupon: {
    getAll: "/api/coupons",
    add: "/api/coupons",
    delete: (id) => `/api/coupons/${id}`,
    update: (id) => `/api/coupons/${id}`,
    validate: "/api/coupons/validate", // Added validate endpoint
  },
  ads: {
    // Public Routes
    getAll: "/api/ads/getAll",

    // Admin Routes
    add: "/api/ads/add",
    update: "/api/ads/update",
    delete: "/api/ads/delete",
  },
  addressBook: {
    // Protected Routes
    getAll: "/api/address-book",
    getPrimary: "/api/address-book/primary",
    getById: (id) => `/api/address-book/${id}`,
    create: "/api/address-book",
    update: (id) => `/api/address-book/${id}`,
    delete: (id) => `/api/address-book/${id}`,
    setPrimary: (id) => `/api/address-book/${id}/primary`,
  },
};
