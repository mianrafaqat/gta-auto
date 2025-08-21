import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FORMAT_INCLUDES = ['image/png', 'image/jpeg', 'image/jpg'];

// Sortable image item component
const SortableImageItem = React.memo(function SortableImageItem({ item, index, isExisting, onRemove }) {
  const itemId = React.useMemo(() => `${isExisting ? 'existing' : 'file'}-${index}`, [isExisting, index]);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = React.useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);
  
  const handleRemoveClick = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item, isExisting);
  }, [item, isExisting, onRemove]);

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'rotate(5deg)' : 'none',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1,
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        ...(isDragging && {
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }),
      }}
    >
      {/* Draggable area - everything except the remove button */}
      <Box
        {...listeners}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />
      <img
        src={isExisting ? item : item.preview}
        alt={`${isExisting ? 'Existing' : 'New'} ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <button
        onClick={handleRemoveClick}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          minWidth: '24px',
          width: '24px',
          height: '24px',
          padding: '0',
          border: 'none',
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: '18px',
          lineHeight: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.7)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.5)';
        }}
      >
        ×
      </button>
      {/* Drag handle indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          left: 4,
          color: 'white',
          fontSize: '12px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '4px',
          padding: '2px 6px',
        }}
      >
        ⋮⋮
      </Box>
    </Box>
  );
});

SortableImageItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  index: PropTypes.number.isRequired,
  isExisting: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default function UploadCarsImages({ setActiveStep = () => {}, isEditMode = false }) {
 
  
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');
  const [isManuallyUpdating, setIsManuallyUpdating] = useState(false);
  
 
  
  const { setValue, watch, formState: { errors }, getValues } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();



  // Check if form context is available
  if (!setValue || !watch || !getValues) {
    console.error('UploadCarsImages: Form context not available', { setValue: !!setValue, watch: !!watch, getValues: !!getValues });
    return <div>Form context error - missing required methods</div>;
  }

  // Watch the image field explicitly
  const image = watch('image');
  
  // Also watch the entire form for debugging
  const allValues = watch();


  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );



  // Track render count - using useRef instead of useState to avoid re-renders
  const renderCountRef = React.useRef(0);
  const prevFilesLengthRef = React.useRef(files.length);
  const prevExistingImagesLengthRef = React.useRef(existingImages.length);
  
  useEffect(() => {
    renderCountRef.current += 1;
    
    // Only log when something important changes
    const filesChanged = prevFilesLengthRef.current !== files.length;
    const existingImagesChanged = prevExistingImagesLengthRef.current !== existingImages.length;
    
    if (filesChanged || existingImagesChanged) {
  
      // Update refs
      prevFilesLengthRef.current = files.length;
      prevExistingImagesLengthRef.current = existingImages.length;
    } else if (renderCountRef.current % 10 === 0) {
      // Log only every 10 renders if nothing important changed
    }
  });


  // Handle drag and drop reordering
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Create a combined array of all images for reordering
      const allImages = [...existingImages, ...files];
      
      // Find the indices
      const oldIndex = allImages.findIndex((_, index) => 
        `${index < existingImages.length ? 'existing' : 'file'}-${index}` === active.id
      );
      const newIndex = allImages.findIndex((_, index) => 
        `${index < existingImages.length ? 'existing' : 'file'}-${index}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder the array
        const reorderedImages = arrayMove(allImages, oldIndex, newIndex);

        // Separate back into existing images and new files
        const newExistingImages = [];
        const newFiles = [];
        
        reorderedImages.forEach(item => {
          if (typeof item === 'string' || item instanceof String) {
            newExistingImages.push(item);
          } else if (item instanceof File) {
            newFiles.push(item);
          }
        });

        setExistingImages(newExistingImages);
        setFiles(newFiles);
        
        // Update form value with reordered images
        setValue('image', reorderedImages);
        
        enqueueSnackbar('Images reordered successfully', { variant: 'success' });
      }
    }
  }, [existingImages, files, setValue, enqueueSnackbar]);

  // Function to verify form state
  const verifyFormState = useCallback(() => {
    const currentFormValue = getValues('image');
    const currentState = [...existingImages, ...files];
    
 
    
    return currentFormValue;
  }, [getValues, existingImages, files]);

  const validateImageCount = useCallback((count) => {
    if (count < 3) {
      setError('Please upload at least 3 images');
      return false;
    }
    if (count > 9) {
      setError('Maximum 9 images allowed');
      return false;
    }
    setError('');
    return true;
  }, [setError]);

  const handleRemoveItem = useCallback((item, isExisting) => {
    try {
      setIsManuallyUpdating(true);
      
      const newState = isExisting
        ? {
            existingImages: existingImages.filter(img => img !== item),
            files
          }
        : {
            existingImages,
            files: files.filter(file => 
              !(file === item || 
                (file.name === item.name && 
                 file.size === item.size && 
                 file.lastModified === item.lastModified))
            )
          };
      
      const combinedImages = [...newState.existingImages, ...newState.files];
      
      setExistingImages(newState.existingImages);
      setFiles(newState.files);
      setValue('image', combinedImages, { shouldValidate: true });
      
      if (combinedImages.length < 3) {
        setError('Please upload at least 3 images');
      } else if (combinedImages.length > 9) {
        setError('Maximum 9 images allowed');
      } else {
        setError('');
      }
      
      enqueueSnackbar('Image removed successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error removing item:', error);
      enqueueSnackbar('Failed to remove image', { variant: 'error' });
    } finally {
      setIsManuallyUpdating(false);
    }
  }, [existingImages, files, setValue, setError, enqueueSnackbar]);

  // Separate handler for Upload component remove
  const handleUploadRemove = useCallback((file) => {
    console.log('Upload component removing file:', file);
    handleRemoveItem(file, false);
  }, [handleRemoveItem]);

  // Simple test function to verify everything is working
  const testRemoveFunction = useCallback(() => {
    console.log('=== TESTING REMOVE FUNCTION ===');
    console.log('Current state:', { files: files.length, existingImages: existingImages.length });
    console.log('Form context available:', { setValue: !!setValue, watch: !!watch, getValues: !!getValues });
    
    if (existingImages.length > 0) {
      console.log('Testing with existing image:', existingImages[0]);
      handleRemoveItem(existingImages[0], true);
    } else if (files.length > 0) {
      console.log('Testing with new file:', files[0]);
      handleRemoveItem(files[0], false);
    } else {
      console.log('No images to test with');
      alert('No images to test with');
    }
  }, [files, existingImages, setValue, watch, getValues, handleRemoveItem]);
  
  const validateFileType = useCallback((file) => {
    if (!FORMAT_INCLUDES.includes(file.type)) {
      enqueueSnackbar(`File type not supported: ${file.name}. Only PNG and JPEG images are allowed.`, {
        variant: 'error',
      });
      return false;
    }
    return true;
  }, [enqueueSnackbar]);

  const handleRemoveAllFiles = useCallback(() => {
    setFiles([]);
    setExistingImages([]);
    setValue('image', []);
    validateImageCount(0);
  }, [setFiles, setExistingImages, setValue, validateImageCount]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const validFiles = acceptedFiles.filter(file => validateFileType(file));
      if (validFiles.length === 0) return;

      const newFiles = [
        ...files,
        ...validFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ];

      const combinedImages = isEditMode 
        ? [...existingImages, ...newFiles]
        : newFiles;

      if (!validateImageCount(combinedImages.length)) {
        return;
      }

      setFiles(newFiles);
      setValue('image', combinedImages, { shouldValidate: true });
    },
    [files, existingImages, setValue, isEditMode, validateFileType, validateImageCount]
  );

  useEffect(() => {
   
    
    if (image?.length) {
      
      // Separate existing URLs from new files
      const urls = [];
      const newFiles = [];
      
      image.forEach(item => {
        if (typeof item === 'string' || item instanceof String) {
          // This is an existing image URL
          urls.push(item);
        } else if (item instanceof File) {
          // This is a new file
          newFiles.push(item);
        }
      });
      
      
      setExistingImages(urls);
      setFiles(newFiles);
      
      // Validate total images
      validateImageCount(urls.length + newFiles.length);
    } else {
      console.log('useEffect: No image data');
      setFiles([]);
      setExistingImages([]);
      validateImageCount(0);
    }
  }, [image, isManuallyUpdating, validateImageCount]);

 

  return (
    <>
      {/* Display all images in a draggable grid */}
      {(existingImages.length > 0 || files.length > 0) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {isEditMode ? 'All Images' : 'Uploaded Images'} ({existingImages.length + files.length})
            <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
              Drag and drop to reorder
            </Typography>
          </Typography>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={[
                ...existingImages.map((_, index) => `existing-${index}`),
                ...files.map((_, index) => `file-${existingImages.length + index}`)
              ]}
              strategy={rectSortingStrategy}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  minHeight: 120,
                  padding: 1,
                  borderRadius: 1,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  border: '1px dashed rgba(0,0,0,0.1)',
                }}
              >
                {/* Render existing images first */}
                {existingImages.map((imageUrl, index) => (
                  <SortableImageItem
                    key={`existing-${index}`}
                    item={imageUrl}
                    index={index}
                    isExisting={true}
                    onRemove={handleRemoveItem}
                  />
                ))}
                
                {/* Render new files */}
                {files.map((file, index) => (
                  <SortableImageItem
                    key={`file-${existingImages.length + index}`}
                    item={file}
                    index={existingImages.length + index}
                    isExisting={false}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        </Box>
      )}

      {/* Upload new images */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {isEditMode ? 'Add New Images' : 'Upload Images'}
        </Typography>
        
      
        <Upload
          multiple
          files={files}
          thumbnail={true}
          onDrop={handleDropMultiFile}
          onRemove={handleUploadRemove}
          onRemoveAll={handleRemoveAllFiles}
          buttonPosition="start"
          accept={{
            'image/*': FORMAT_INCLUDES
          }}
        />
      </Box>
      
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
          {error}
        </Typography>
      )}

      {errors?.image?.message && (
        <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
          {errors.image.message}
        </Typography>
      )}

      <Box sx={{ mt: 3, textAlign: 'end' }}>
        <Button onClick={() => setActiveStep((prev) => prev - 1)}>Back</Button>
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          onClick={() => {
            const totalImages = existingImages.length + files.length;
            if (totalImages < 3) {
              enqueueSnackbar('Please upload at least 3 images to proceed', { 
                variant: 'warning',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                }
              });
              return;
            }
            if (totalImages > 9) {
              enqueueSnackbar('Maximum 9 images allowed', { 
                variant: 'warning',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                }
              });
              return;
            }
            setActiveStep((prev) => prev + 1);
          }}
        >
          Next
        </Button>
      </Box>
    </>
  );
}

UploadCarsImages.propTypes = {
  setActiveStep: PropTypes.func,
  isEditMode: PropTypes.bool,
};
