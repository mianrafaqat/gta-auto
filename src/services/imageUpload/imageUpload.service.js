import { API_URLS } from "src/utils/apiUrls";
import gtaAutosInstance from "src/utils/requestInterceptor";

class ImageUploadService {
  /**
   * Upload image(s) for blog posts
   * @param {FormData} formData - Multipart form data with image file(s)
   * @returns {Promise<Object>}
   */
  uploadBlogImage = async (formData) => {
    try {
      const res = await gtaAutosInstance.post(
        API_URLS.blog.uploadImage,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (ex) {
      const errorMessage = ex.response?.data?.message || ex.message || "Failed to upload blog image";
      const error = new Error(errorMessage);
      error.response = ex.response;
      error.status = ex.response?.status;
      throw error;
    }
  };

  /**
   * Upload image(s) for forum posts
   * @param {FormData} formData - Multipart form data with image file(s)
   * @returns {Promise<Object>}
   */
  uploadForumImage = async (formData) => {
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

  /**
   * Generic image upload method that can be used for both blog and forum
   * @param {FormData} formData - Multipart form data with image file(s)
   * @param {string} type - Type of upload ('blog' or 'forum')
   * @returns {Promise<Object>}
   */
  uploadImage = async (formData, type = 'blog') => {
    try {
      // Use specific endpoints: /api/blogs/upload-image or /api/forum/upload-image
      const endpoint = type === 'forum' ? API_URLS.forum.uploadImage : API_URLS.blog.uploadImage;
      
      const res = await gtaAutosInstance.post(
        endpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (ex) {
      const errorMessage = ex.response?.data?.message || ex.message || `Failed to upload ${type} image`;
      const error = new Error(errorMessage);
      error.response = ex.response;
      error.status = ex.response?.status;
      throw error;
    }
  };

  /**
   * Helper method to create FormData from files
   * @param {File|File[]} files - Single file or array of files
   * @param {string} fieldName - Field name for the files (default: 'image')
   * @returns {FormData}
   */
  createFormData = (files, fieldName = 'image') => {
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : [files];
    
    fileArray.forEach((file) => {
      if (file instanceof File) {
        formData.append(fieldName, file);
      }
    });
    
    return formData;
  };

  /**
   * Helper method to validate image files
   * @param {File|File[]} files - Single file or array of files
   * @param {Object} options - Validation options
   * @returns {Object} - Validation result
   */
  validateImages = (files, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      maxFiles = 10,
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    } = options;

    const fileArray = Array.isArray(files) ? files : [files];
    const errors = [];

    // Check file count
    if (fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed. You selected ${fileArray.length} files.`);
    }

    // Check each file
    fileArray.forEach((file, index) => {
      if (!(file instanceof File)) {
        errors.push(`File ${index + 1} is not a valid file object.`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        errors.push(`File "${file.name}" is ${fileSizeMB}MB. Maximum size allowed is ${maxSizeMB}MB.`);
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File "${file.name}" has unsupported type "${file.type}". Allowed types: ${allowedTypes.join(', ')}.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      fileCount: fileArray.length
    };
  };

  /**
   * Helper method to extract image URL from API response
   * @param {Object} response - API response object
   * @returns {string|null} - Extracted image URL or null
   */
  extractImageUrl = (response) => {
    // Handle your API format: { success: true, message: "...", imageUrls: ["..."] }
    if (response?.imageUrls && Array.isArray(response.imageUrls) && response.imageUrls.length > 0) {
      return response.imageUrls[0];
    }
    
    // Handle other possible formats
    if (response?.url) return response.url;
    if (response?.imageUrl) return response.imageUrl;
    if (response?.data?.url) return response.data.url;
    if (response?.urls && Array.isArray(response.urls) && response.urls.length > 0) {
      return response.urls[0];
    }
    if (typeof response === 'string') return response;
    
    return null;
  };
}

const instance = new ImageUploadService();
export default instance;
