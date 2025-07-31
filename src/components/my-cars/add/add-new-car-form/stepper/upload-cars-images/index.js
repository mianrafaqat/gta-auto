import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';

const FORMAT_INCLUDES = ['image/png', 'image/jpeg', 'image/jpg'];

export default function UploadCarsImages({ setActiveStep = () => {}, isEditMode = false }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const { setValue, watch, formState: { errors } } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();

  const { image } = watch();

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
    setValue('image', filesFiltered);
    validateFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setValue('image', []);
    validateFiles([]);
  };

  const validateFiles = (currentFiles) => {
    if (currentFiles.length < 3) {
      setError('Please upload at least 3 images');
      return false;
    }
    if (currentFiles.length > 9) {
      setError('Maximum 9 images allowed');
      return false;
    }
    setError('');
    return true;
  };

  const validateFileType = (file) => {
    if (!FORMAT_INCLUDES.includes(file.type)) {
      enqueueSnackbar(`File type not supported: ${file.name}. Only PNG and JPEG images are allowed.`, {
        variant: 'error',
      });
      return false;
    }
    return true;
  };

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

      // Check if total files don't exceed 9
      if (newFiles.length > 9) {
        enqueueSnackbar('Maximum 9 images allowed', { variant: 'error' });
        return;
      }

      setFiles(newFiles);
      setValue('image', newFiles);
      validateFiles(newFiles);
    },
    [files, setValue, enqueueSnackbar]
  );

  useEffect(() => {
    if (image?.length) {
      setFiles([...image]);
      validateFiles([...image]);
    } else {
      setFiles([]);
      validateFiles([]);
    }
  }, [image]);

  return (
    <>
      <Upload
        multiple
        files={files}
        thumbnail={true}
        onDrop={handleDropMultiFile}
        onRemove={handleRemoveFile}
        onRemoveAll={handleRemoveAllFiles}
        buttonPosition="start"
        accept={{
          'image/*': FORMAT_INCLUDES
        }}
      />
      
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
            if (files.length < 3) {
              enqueueSnackbar('Please upload at least 3 images to proceed', { 
                variant: 'warning',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                }
              });
              return;
            }
            if (files.length > 9) {
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
