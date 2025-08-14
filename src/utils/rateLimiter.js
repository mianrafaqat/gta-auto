/**
 * Rate Limiting Utility
 * 
 * Implements rate limiting according to the eCommerce API documentation:
 * - 100 requests per minute for authenticated users
 * - 30 requests per minute for unauthenticated users
 */

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      authenticated: { max: 100, window: 60000 }, // 100 requests per minute
      unauthenticated: { max: 30, window: 60000 }, // 30 requests per minute
    };
  }

  /**
   * Check if request is allowed
   * @param {string} key - Unique identifier (user ID or IP)
   * @param {boolean} isAuthenticated - Whether user is authenticated
   * @returns {boolean} - True if request is allowed
   */
  isAllowed(key, isAuthenticated = false) {
    const now = Date.now();
    const limit = isAuthenticated ? this.limits.authenticated : this.limits.unauthenticated;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key);
    
    // Remove expired requests
    const validRequests = userRequests.filter(timestamp => now - timestamp < limit.window);
    
    // Check if under limit
    if (validRequests.length < limit.max) {
      validRequests.push(now);
      this.requests.set(key, validRequests);
      return true;
    }
    
    return false;
  }

  /**
   * Get remaining requests for a user
   * @param {string} key - Unique identifier
   * @param {boolean} isAuthenticated - Whether user is authenticated
   * @returns {Object} - { remaining, resetTime }
   */
  getRemaining(key, isAuthenticated = false) {
    const now = Date.now();
    const limit = isAuthenticated ? this.limits.authenticated : this.limits.unauthenticated;
    
    if (!this.requests.has(key)) {
      return {
        remaining: limit.max,
        resetTime: now + limit.window,
      };
    }
    
    const userRequests = this.requests.get(key);
    const validRequests = userRequests.filter(timestamp => now - timestamp < limit.window);
    const remaining = Math.max(0, limit.max - validRequests.length);
    
    // Find next reset time
    const oldestRequest = Math.min(...validRequests);
    const resetTime = oldestRequest + limit.window;
    
    return {
      remaining,
      resetTime,
    };
  }

  /**
   * Reset rate limit for a user
   * @param {string} key - Unique identifier
   */
  reset(key) {
    this.requests.delete(key);
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    const maxWindow = Math.max(this.limits.authenticated.window, this.limits.unauthenticated.window);
    
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => now - timestamp < maxWindow);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }

  /**
   * Get rate limit headers for response
   * @param {string} key - Unique identifier
   * @param {boolean} isAuthenticated - Whether user is authenticated
   * @returns {Object} - Rate limit headers
   */
  getHeaders(key, isAuthenticated = false) {
    const { remaining, resetTime } = this.getRemaining(key, isAuthenticated);
    const limit = isAuthenticated ? this.limits.authenticated.max : this.limits.unauthenticated.max;
    
    return {
      'X-RateLimit-Limit': limit,
      'X-RateLimit-Remaining': remaining,
      'X-RateLimit-Reset': resetTime,
    };
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Clean up expired entries every minute
setInterval(() => {
  rateLimiter.cleanup();
}, 60000);

export default rateLimiter;

// Export individual functions for convenience
export const {
  isAllowed,
  getRemaining,
  reset,
  cleanup,
  getHeaders,
} = rateLimiter;
