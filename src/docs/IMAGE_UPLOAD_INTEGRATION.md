# Image Upload Integration Guide

This document explains how to use the imageuploader API endpoint for blog and forum images.

## API Endpoints

### Blog Images
- **Endpoint**: `/api/blogs/upload-image`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Forum Images
- **Endpoint**: `/api/forum/upload-image`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

## Services Available

### 1. ImageUploadService (Generic)
```javascript
import ImageUploadService from "src/services/imageUpload/imageUpload.service";

// Upload for blog
const formData = ImageUploadService.createFormData(file, 'image');
const response = await ImageUploadService.uploadImage(formData, 'blog');

// Upload for forum
const response = await ImageUploadService.uploadImage(formData, 'forum');

// Validate images before upload
const validation = ImageUploadService.validateImages(files, {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 1,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
});
```

### 2. BlogService
```javascript
import BlogService from "src/services/blog/blog.service";

const formData = new FormData();
formData.append('image', file);
const response = await BlogService.uploadImage(formData);
```

### 3. ForumService
```javascript
import ForumService from "src/services/forum/forum.service";

const formData = new FormData();
formData.append('image', file);
const response = await ForumService.uploadImage(formData);
```

## Implementation Examples

### Blog Post Form (Already Implemented)

The blog post form in `src/sections/blog/post-new-edit-form.js` now uses the imageuploader API:

```javascript
const handleDrop = useCallback(
  async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      // Validate the image
      const validation = ImageUploadService.validateImages(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 1,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      });

      if (!validation.isValid) {
        enqueueSnackbar(validation.errors.join(', '), { variant: "error" });
        return;
      }

      // Upload image using the imageuploader API
      const formData = ImageUploadService.createFormData(file, 'image');
      const response = await BlogService.uploadImage(formData);
      
      // Handle response and set form value
      const imageUrl = response?.url || response?.imageUrl || response?.urls?.[0];
      if (imageUrl) {
        setValue("coverUrl", imageUrl, { shouldValidate: true });
        enqueueSnackbar("Image uploaded successfully!", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to upload image", { variant: "error" });
    }
  },
  [setValue, enqueueSnackbar]
);
```

### Forum Components Usage

For forum components, you can use the ForumService:

```javascript
import ForumService from "src/services/forum/forum.service";
import ImageUploadService from "src/services/imageUpload/imageUpload.service";

const handleForumImageUpload = async (file) => {
  try {
    // Validate image
    const validation = ImageUploadService.validateImages(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Create FormData
    const formData = ImageUploadService.createFormData(file, 'image');
    
    // Upload using forum service
    const response = await ForumService.uploadImage(formData);
    
    // Extract image URL using helper method (handles your API format automatically)
    const imageUrl = ImageUploadService.extractImageUrl(response);
    
    if (!imageUrl) {
      throw new Error('No image URL returned from upload service');
    }
    
    return imageUrl;
  } catch (error) {
    console.error('Forum image upload failed:', error);
    throw error;
  }
};
```

## Response Formats

The image upload API returns the following format. The services handle this automatically:

```javascript
// Your API response format:
{
  "success": true,
  "message": "All images uploaded successfully",
  "imageUrls": ["https://i.ibb.co/9mZ6hXgy/34fe26c7a28b.png"]
}

// The services also handle other possible formats for compatibility:
{
  "url": "https://example.com/image.jpg"
}

// OR
{
  "imageUrl": "https://example.com/image.jpg"
}

// OR
{
  "urls": ["https://example.com/image.jpg"]
}

// OR
{
  "data": {
    "url": "https://example.com/image.jpg"
  }
}
```

## Validation Options

The ImageUploadService provides comprehensive validation:

```javascript
const validationOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB (default)
  maxFiles: 10, // Maximum number of files (default)
  allowedTypes: [ // Allowed MIME types (default)
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ]
};

const validation = ImageUploadService.validateImages(files, validationOptions);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

## Error Handling

All services provide consistent error handling:

```javascript
try {
  const response = await BlogService.uploadImage(formData);
  // Handle success
} catch (error) {
  // Error object includes:
  // - error.message: User-friendly error message
  // - error.response: Original API response
  // - error.status: HTTP status code
  console.error('Upload failed:', error.message);
}
```

## Integration Checklist

- ✅ Added `/api/blogs/upload-image` endpoint to `API_URLS.blog.uploadImage`
- ✅ Added `/api/forum/upload-image` endpoint to `API_URLS.forum.uploadImage`
- ✅ Created `ImageUploadService` with validation and helper methods
- ✅ Added `uploadImage` method to `BlogService`
- ✅ Added `uploadImage` method to `ForumService`
- ✅ Updated blog post form to use imageuploader API
- ✅ Provided comprehensive error handling
- ✅ Added image validation (size, type, count)
- ✅ Created documentation and usage examples

## Next Steps

1. **Test the integration** with your backend imageuploader endpoint
2. **Update forum components** to use `ForumService.uploadImage()`
3. **Customize validation rules** based on your requirements
4. **Add progress indicators** for better UX during uploads
5. **Implement image preview** functionality if needed

## Backend Requirements

Ensure your backend image upload endpoints accept:

### Blog Images (`/api/blogs/upload-image`)
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field name**: 'image' (configurable in FormData creation)
- **Response**: JSON with image URL(s) in one of the supported formats above

### Forum Images (`/api/forum/upload-image`)
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field name**: 'image' (configurable in FormData creation)
- **Response**: JSON with image URL(s) in one of the supported formats above
