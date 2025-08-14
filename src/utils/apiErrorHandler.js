/**
 * API Error Handler Utility
 * 
 * Handles errors according to the eCommerce API documentation format:
 * {
 *   "error": "Error message"
 * }
 */

/**
 * Extract error message from API response
 * @param {Object} error - Error object from axios or fetch
 * @returns {string} - Error message
 */
export const extractErrorMessage = (error) => {
  // Handle axios error response
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Handle axios error response without error field
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Handle axios error response with description
  if (error?.response?.data?.description) {
    return error.response.data.description;
  }
  
  // Handle direct error message
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle error object with message
  if (error?.message) {
    return error.message;
  }
  
  // Default fallback
  return 'Something went wrong';
};

/**
 * Check if error is a specific HTTP status
 * @param {Object} error - Error object
 * @param {number} status - HTTP status code
 * @returns {boolean}
 */
export const isErrorStatus = (error, status) => {
  return error?.response?.status === status;
};

/**
 * Check if error is unauthorized (401)
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isUnauthorized = (error) => {
  return isErrorStatus(error, 401);
};

/**
 * Check if error is forbidden (403)
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isForbidden = (error) => {
  return isErrorStatus(error, 403);
};

/**
 * Check if error is not found (404)
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isNotFound = (error) => {
  return isErrorStatus(error, 404);
};

/**
 * Check if error is server error (5xx)
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isServerError = (error) => {
  const status = error?.response?.status;
  return status >= 500 && status < 600;
};

/**
 * Get HTTP status code from error
 * @param {Object} error - Error object
 * @returns {number|null} - HTTP status code or null
 */
export const getErrorStatus = (error) => {
  return error?.response?.status || null;
};

/**
 * Format error for display
 * @param {Object} error - Error object
 * @returns {Object} - Formatted error object
 */
export const formatError = (error) => {
  const message = extractErrorMessage(error);
  const status = getErrorStatus(error);
  
  return {
    message,
    status,
    isUnauthorized: isUnauthorized(error),
    isForbidden: isForbidden(error),
    isNotFound: isNotFound(error),
    isServerError: isServerError(error),
    originalError: error,
  };
};

/**
 * Handle API error with custom logic
 * @param {Object} error - Error object
 * @param {Function} onUnauthorized - Callback for 401 errors
 * @param {Function} onForbidden - Callback for 403 errors
 * @param {Function} onNotFound - Callback for 404 errors
 * @param {Function} onServerError - Callback for 5xx errors
 * @returns {Object} - Formatted error object
 */
export const handleApiError = (error, {
  onUnauthorized = null,
  onForbidden = null,
  onNotFound = null,
  onServerError = null,
} = {}) => {
  const formattedError = formatError(error);
  
  // Execute callbacks based on error type
  if (formattedError.isUnauthorized && onUnauthorized) {
    onUnauthorized(formattedError);
  }
  
  if (formattedError.isForbidden && onForbidden) {
    onForbidden(formattedError);
  }
  
  if (formattedError.isNotFound && onNotFound) {
    onNotFound(formattedError);
  }
  
  if (formattedError.isServerError && onServerError) {
    onServerError(formattedError);
  }
  
  return formattedError;
};

export default {
  extractErrorMessage,
  isErrorStatus,
  isUnauthorized,
  isForbidden,
  isNotFound,
  isServerError,
  getErrorStatus,
  formatError,
  handleApiError,
};
