import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

/**
 * BlogCommentService handles API calls for blog comments.
 *
 * Endpoints:
 * - GET /api/blog-comment/blog/:blogId
 * - GET /api/blog-comment/:commentId
 * - GET /api/blog-comment
 * - POST /api/blog-comment
 * - PUT /api/blog-comment/:commentId
 * - DELETE /api/blog-comment/:commentId
 * - GET /api/blog-comment/admin/all
 * - GET /api/blog-comment/admin/stats
 * - PUT /api/blog-comment/admin/:commentId/moderate
 * - PUT /api/blog-comment/admin/bulk-moderate
 */
class BlogCommentService {
  /**
   * Get comments for a specific blog post.
   * @param {string} blogId - Blog ID
   * @param {Object} params - Optional query params: { page, limit, ... }
   * @returns {Promise<{comments: Array, pagination: Object}>}
   */
  getByBlog = async (blogId, params = {}) => {
    try {
      const res = await gtaAutosInstance.get(
        API_URLS.blogComment.getByBlog(blogId),
        {
          params,
        }
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get a comment by its ID.
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>}
   */
  getById = async (commentId) => {
    try {
      const res = await gtaAutosInstance.get(
        API_URLS.blogComment.getById(commentId)
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get all comments with optional query params (pagination, filters, etc).
   * @param {Object} params - Optional query params: { page, limit, ... }
   * @returns {Promise<{comments: Array, pagination: Object}>}
   */
  getAll = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.blogComment.getAll, {
        params,
      });
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Create a new comment.
   * @param {Object} data - Comment data
   * @returns {Promise<Object>}
   */
  create = async (data) => {
    try {
      console.log("Creating blog comment with data:", data);
      console.log("Using endpoint:", API_URLS.blogComment.create);

      const res = await gtaAutosInstance.post(
        API_URLS.blogComment.create,
        data
      );
      console.log("Blog comment creation response:", res);
      return res.data;
    } catch (ex) {
      console.error("Error creating blog comment:", {
        error: ex,
        endpoint: API_URLS.blogComment.create,
        requestData: data,
        response: ex.response?.data,
      });
      throw ex;
    }
  };

  /**
   * Update an existing comment.
   * @param {string} commentId - Comment ID
   * @param {Object} data - Updated comment data
   * @returns {Promise<Object>}
   */
  update = async (commentId, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.blogComment.update(commentId),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Delete a comment.
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>}
   */
  delete = async (commentId) => {
    try {
      const res = await gtaAutosInstance.delete(
        API_URLS.blogComment.delete(commentId)
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get all comments for admin (with additional data).
   * @param {Object} params - Optional query params: { page, limit, ... }
   * @returns {Promise<{comments: Array, pagination: Object}>}
   */
  getAdminAll = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.blogComment.getAdminAll, {
        params,
      });
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get comment statistics for admin.
   * @returns {Promise<Object>}
   */
  getAdminStats = async () => {
    try {
      const res = await gtaAutosInstance.get(
        API_URLS.blogComment.getAdminStats
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Moderate a comment (approve/reject).
   * @param {string} commentId - Comment ID
   * @param {Object} data - Moderation data: { status, reason }
   * @returns {Promise<Object>}
   */
  moderate = async (commentId, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.blogComment.moderate(commentId),
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Bulk moderate multiple comments.
   * @param {Object} data - Bulk moderation data: { commentIds: Array, status, reason }
   * @returns {Promise<Object>}
   */
  bulkModerate = async (data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.blogComment.bulkModerate,
        data
      );
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new BlogCommentService();
export default instance;
