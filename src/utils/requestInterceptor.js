import axios from "axios";
import { API_BASE_URL } from "src/config/app";
import { paths } from "src/routes/paths";
import { ACCESS_TOKEN_KEY } from "./constants";
import { refreshAccessToken } from "src/auth/context/jwt/utils";
import rateLimiter from "./rateLimiter";
import { handleApiError } from "./apiErrorHandler";

const gtaAutosInstance = axios.create({
  baseURL: API_BASE_URL,
});

gtaAutosInstance.interceptors.request.use((config) => {
  if (config.url === "/api/user/refresh-token") {
    return config;
  }

  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
  const userKey = isAuthenticated ? 'authenticated' : 'anonymous';
  
  if (!rateLimiter.isAllowed(userKey, isAuthenticated)) {
    const error = new Error('Rate limit exceeded. Please try again later.');
    return Promise.reject(error);
  }

  if (!config.headers.Authorization) {
    const authToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
   
    }
  }

  return config;
});

gtaAutosInstance.interceptors.response.use(
  (response) => {
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    const userKey = isAuthenticated ? 'authenticated' : 'anonymous';
    const rateLimitHeaders = rateLimiter.getHeaders(userKey, isAuthenticated);
    
    Object.assign(response.headers, rateLimitHeaders);
    
    return response;
  },
  async (error) => {
    
 
    
    const originalRequest = error.config;

    if (error?.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      return Promise.reject(error);
    }

    const publicEndpoints = [
      '/api/products',
      '/api/car/getAll',
      '/api/car/carsList',
      '/api/car/carsBodyList',
      '/api/car/getCarModelsByCar',
      '/api/car/getCarModelsByYear',
      '/api/car/filterByMakeAndModel',
      '/api/blogs/getAll',
      '/api/blogs/get/',
      '/api/ads/getAll',
      '/api/video/getAll',
      '/api/categories',
      '/api/categories/tree',
      '/api/categories/attributes',
      '/api/tax',
      '/api/coupons',
      '/api/forum/categories',
      '/api/forum/search',
      '/api/forum/stats',
      '/api/forum/comments',  // GET comments
      '/api/forum/replies',   // GET replies
      '/api/blog-comments/blog/',
      '/api/blog-comments/',
      // '/api/address-book/primary',
      // '/api/address-book/getAll',
      // '/api/address-book',
      '/api/shipping/available',
      '/api/shipping/calculate',
      '/api/orders',

    ];

    const optionalAuthEndpoints = [
      '/api/user/addOrRemoveFavourite',
      '/api/user/getUserFavouriteCars',
      '/api/user/addOrRemoveFavouriteProduct'
    ];

  
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      originalRequest.url && originalRequest.url.includes(endpoint)
    ) || (
      originalRequest.url && 
      (originalRequest.url.includes('/api/forum/topics') || 
       originalRequest.url.includes('/api/forum/comments') || 
       originalRequest.url.includes('/api/forum/replies')) &&
      originalRequest.method && 
      originalRequest.method.toUpperCase() === 'GET'
    );

    // Check if the current request is to an optional auth endpoint
    const isOptionalAuthEndpoint = optionalAuthEndpoints.some(endpoint => 
      originalRequest.url && originalRequest.url.includes(endpoint)
    );

    // If error is not 401 or request has already been retried, reject
    if (error?.response?.status !== 401 || originalRequest._retry) {
      // Use the new error handler
      const formattedError = handleApiError(error, {
        onUnauthorized: (error) => {
          // console.warn('Unauthorized request:', error.message);
        },
        onForbidden: (error) => {
          // console.warn('Forbidden request:', error.message);
        },
        onNotFound: (error) => {
          // console.warn('Resource not found:', error.message);
        },
        onServerError: (error) => {
          console.error('Server error:', error.message);
        },
      });
      
      return Promise.reject(formattedError);
    }

    // For public endpoints, don't attempt token refresh or redirect
    if (isPublicEndpoint) {
      return Promise.reject(error);
    }

    // For optional auth endpoints, fail silently without redirecting to login
    if (isOptionalAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Try to refresh the token
      const newAccessToken = await refreshAccessToken();

      // Update the failed request with new token and retry
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return gtaAutosInstance(originalRequest);
    } catch (refreshError) {
      // If refresh fails, redirect to login
      window.location.href = paths.auth.jwt.login;
      return Promise.reject(refreshError);
    }
  }
);

export default gtaAutosInstance;
