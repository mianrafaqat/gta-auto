import axios from 'axios';
import { API_BASE_URL } from 'src/config/app';
import { paths } from 'src/routes/paths';
import { ACCESS_TOKEN_KEY } from './constants';
import { refreshAccessToken } from 'src/auth/context/jwt/utils';

const gtaAutosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
gtaAutosInstance.interceptors.request.use((config) => {
  // Don't add token for refresh token request
  if (config.url === '/api/user/refresh-token') {
    return config;
  }
  
  const authToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (authToken) {
    config.headers.Authorization = 'Bearer ' + authToken;
  }
  return config;
});

// Response interceptor
gtaAutosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request has already been retried, reject
    if (error?.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error?.response?.data || 'Something went wrong');
    }

    originalRequest._retry = true;

    try {
      // Try to refresh the token
      const newAccessToken = await refreshAccessToken();
      
      // Update the failed request with new token and retry
      originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
      return gtaAutosInstance(originalRequest);
    } catch (refreshError) {
      // If refresh fails, redirect to login
      window.location.href = paths.auth.jwt.login;
      return Promise.reject(refreshError);
    }
  }
);

export default gtaAutosInstance;
