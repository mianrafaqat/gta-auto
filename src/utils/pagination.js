/**
 * Pagination Utility
 * 
 * Handles pagination according to the eCommerce API documentation format:
 * {
 *   "data": [...],
 *   "pagination": {
 *     "total": 100,
 *     "page": 1,
 *     "pages": 10
 *   }
 * }
 */

/**
 * Default pagination parameters
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

/**
 * Build pagination query parameters
 * @param {Object} params - Pagination parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Object} - Query parameters object
 */
export const buildPaginationParams = (params = {}) => {
  const { page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit } = params;
  
  return {
    page: Math.max(1, parseInt(page)),
    limit: Math.max(1, Math.min(100, parseInt(limit))), // Cap at 100 items per page
  };
};

/**
 * Extract pagination data from API response
 * @param {Object} response - API response object
 * @returns {Object} - Pagination object with fallbacks
 */
export const extractPagination = (response) => {
  if (!response) {
    return {
      total: 0,
      page: 1,
      pages: 1,
      limit: DEFAULT_PAGINATION.limit,
    };
  }

  const pagination = response.pagination || {};
  
  return {
    total: pagination.total || 0,
    page: pagination.page || 1,
    pages: pagination.pages || 1,
    limit: pagination.limit || DEFAULT_PAGINATION.limit,
  };
};

/**
 * Calculate pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} - Calculated pagination metadata
 */
export const calculatePagination = (total, page = 1, limit = DEFAULT_PAGINATION.limit) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * limit;
  
  return {
    total,
    page: currentPage,
    pages: totalPages,
    limit,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
};

/**
 * Create pagination object for API requests
 * @param {Object} params - Pagination parameters
 * @returns {Object} - Pagination object
 */
export const createPagination = (params = {}) => {
  const { page, limit } = buildPaginationParams(params);
  return { page, limit };
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validatePagination = (params = {}) => {
  const errors = [];
  const { page, limit } = params;
  
  if (page !== undefined && (isNaN(page) || page < 1)) {
    errors.push('Page must be a positive number');
  }
  
  if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get pagination info for display
 * @param {Object} pagination - Pagination object
 * @returns {Object} - Display information
 */
export const getPaginationInfo = (pagination) => {
  const { total, page, pages, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  
  return {
    total,
    page,
    pages,
    limit,
    start,
    end,
    showing: `${start}-${end} of ${total}`,
    hasMultiplePages: pages > 1,
    isFirstPage: page === 1,
    isLastPage: page === pages,
  };
};

/**
 * Create pagination controls data
 * @param {Object} pagination - Pagination object
 * @param {number} maxVisible - Maximum visible page numbers
 * @returns {Object} - Pagination controls data
 */
export const createPaginationControls = (pagination, maxVisible = 5) => {
  const { page, pages } = pagination;
  
  if (pages <= maxVisible) {
    // Show all pages if total is small
    return {
      pages: Array.from({ length: pages }, (_, i) => i + 1),
      showFirst: false,
      showLast: false,
      showEllipsis: false,
    };
  }
  
  // Calculate visible page range
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(pages, start + maxVisible - 1);
  
  // Adjust start if end is at the limit
  if (end === pages) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  
  return {
    pages: visiblePages,
    showFirst: start > 1,
    showLast: end < pages,
    showEllipsis: start > 2 || end < pages - 1,
    firstPage: 1,
    lastPage: pages,
  };
};

export default {
  DEFAULT_PAGINATION,
  buildPaginationParams,
  extractPagination,
  calculatePagination,
  createPagination,
  validatePagination,
  getPaginationInfo,
  createPaginationControls,
};
