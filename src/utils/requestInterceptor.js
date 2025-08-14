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

// Request interceptor
gtaAutosInstance.interceptors.request.use((config) => {
  // Don't add token for refresh token request
  if (config.url === "/api/user/refresh-token") {
    return config;
  }

  // Check rate limiting
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
  const userKey = isAuthenticated ? 'authenticated' : 'anonymous';
  
  if (!rateLimiter.isAllowed(userKey, isAuthenticated)) {
    const error = new Error('Rate limit exceeded. Please try again later.');
    error.response = { status: 429, data: { error: 'Rate limit exceeded' } };
    return Promise.reject(error);
  }

  // Only add Authorization header if it's not already set
  if (!config.headers.Authorization) {
    const authToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log("🔐 [REQUEST] Added token to request:", config.url);
      console.log("🔐 [REQUEST] Token preview:", authToken.substring(0, 20) + "...");
    }
  }

  return config;
});

// Response interceptor
gtaAutosInstance.interceptors.response.use(
  (response) => {
    // Add rate limit headers to response
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    const userKey = isAuthenticated ? 'authenticated' : 'anonymous';
    const rateLimitHeaders = rateLimiter.getHeaders(userKey, isAuthenticated);
    
    Object.assign(response.headers, rateLimitHeaders);
    
    console.log("✅ [RESPONSE] Success:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.log("❌ [RESPONSE] Error:", error.config?.url, error.response?.status, error.message);
    
    if (error.response) {
      console.log("❌ [RESPONSE] Error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    const originalRequest = error.config;

    // Handle rate limiting errors
    if (error?.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limited. Retry after ${retryAfter} seconds.`);
      return Promise.reject(error);
    }

    // If error is not 401 or request has already been retried, reject
    if (error?.response?.status !== 401 || originalRequest._retry) {
      // Use the new error handler
      const formattedError = handleApiError(error, {
        onUnauthorized: (error) => {
          console.warn('Unauthorized request:', error.message);
        },
        onForbidden: (error) => {
          console.warn('Forbidden request:', error.message);
        },
        onNotFound: (error) => {
          console.warn('Resource not found:', error.message);
        },
        onServerError: (error) => {
          console.error('Server error:', error.message);
        },
      });
      
      return Promise.reject(formattedError);
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
