import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class ForumService {
  // ========================================
  // FORUM CATEGORIES
  // ========================================

  // Get all categories
  getAllCategories = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.forum.categories.getAll);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Create category (admin only)
  createCategory = async (data) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.forum.categories.create,
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Update category (admin only)
  updateCategory = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.forum.categories.update(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Delete category (admin only)
  deleteCategory = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(
        API_URLS.forum.categories.delete(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // ========================================
  // FORUM TOPICS
  // ========================================

  // Get all topics with pagination and filtering
  getAllTopics = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.forum.topics.getAll, {
        params,
      });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Get topic by ID
  getTopicById = async (id) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.forum.topics.getById(id));
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Create new topic (authenticated users only)
  createTopic = async (data) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.forum.topics.create,
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Update topic (author or admin only)
  updateTopic = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.forum.topics.update(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Delete topic (author or admin only)
  deleteTopic = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(
        API_URLS.forum.topics.delete(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Toggle like on topic
  toggleTopicLike = async (id) => {
    try {
      const res = await gtaAutosInstance.patch(
        API_URLS.forum.topics.toggleLike(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Toggle pin on topic (admin only)
  toggleTopicPin = async (id, data) => {
    try {
      const res = await gtaAutosInstance.patch(
        API_URLS.forum.topics.togglePin(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Toggle lock on topic (admin only)
  toggleTopicLock = async (id, data) => {
    try {
      const res = await gtaAutosInstance.patch(
        API_URLS.forum.topics.toggleLock(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // ========================================
  // FORUM COMMENTS
  // ========================================

  // Get comments for a topic
  getCommentsByTopic = async (topicId, params = {}) => {
    try {
      const res = await gtaAutosInstance.get(
        API_URLS.forum.comments.getByTopic(topicId),
        { params }
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Create comment (authenticated users only)
  createComment = async (topicId, data) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.forum.comments.create(topicId),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Update comment (author or admin only)
  updateComment = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.forum.comments.update(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Delete comment (author or admin only)
  deleteComment = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(
        API_URLS.forum.comments.delete(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Toggle like on comment
  toggleCommentLike = async (id) => {
    try {
      const res = await gtaAutosInstance.patch(
        API_URLS.forum.comments.toggleLike(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // ========================================
  // FORUM REPLIES
  // ========================================

  // Get replies for a comment
  getRepliesByComment = async (commentId) => {
    try {
      const res = await gtaAutosInstance.get(
        API_URLS.forum.replies.getByComment(commentId)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Create reply (authenticated users only)
  createReply = async (commentId, data) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.forum.replies.create(commentId),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Update reply (author or admin only)
  updateReply = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(
        API_URLS.forum.replies.update(id),
        data
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Delete reply (author or admin only)
  deleteReply = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(
        API_URLS.forum.replies.delete(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Toggle like on reply
  toggleReplyLike = async (id) => {
    try {
      const res = await gtaAutosInstance.patch(
        API_URLS.forum.replies.toggleLike(id)
      );
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // ========================================
  // FORUM SEARCH AND STATISTICS
  // ========================================

  // Search topics and comments
  search = async (params = {}) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.forum.search, { params });
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // Get forum statistics
  getStats = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.forum.stats);
      return res;
    } catch (ex) {
      throw ex;
    }
  };

  // ========================================
  // FORUM IMAGE UPLOAD
  // ========================================

  // Upload image for forum posts
  uploadImage = async (formData) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.forum.uploadImage,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (ex) {
      const errorMessage = ex.response?.data?.message || ex.message || "Failed to upload forum image";
      const error = new Error(errorMessage);
      error.response = ex.response;
      error.status = ex.response?.status;
      throw error;
    }
  };
}

const instance = new ForumService();
export default instance;
