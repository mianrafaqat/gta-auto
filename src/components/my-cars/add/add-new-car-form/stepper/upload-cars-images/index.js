import { Box, Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload } from 'src/components/upload';

const FORMAT_INCLUDES = ['image/png', 'image/jpeg', 'image/jpg'];

export default function UploadCarsImages({ setActiveStep = () => {}, isEditMode = false }) {
  const [files, setFiles] = useState([]);
  const { setValue, watch } = useFormContext();

  const { image } = watch();

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };
  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleDropRestrictedFormats = () => {
    if (files.length) {
      const filteredFiles = files.filter((file) => typeof file === 'string' || FORMAT_INCLUDES.includes(file.type));
      setFiles(filteredFiles);
      setValue('image', filteredFiles);
    }
  };

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  useEffect(() => {
    handleDropRestrictedFormats();
  }, [JSON.stringify(files)]);

  useEffect(() => {
    if (image?.length) {
      setFiles([...image]);
    } else {
      setFiles([]);
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
        // onUpload={() => console.info('ON UPLOAD')}
      />
      <Box sx={{ mt: 1, textAlign: 'end', mt: 3 }}>
        <Button onClick={() => setActiveStep((prev) => prev - 1)}>Back</Button>
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          disabled={Boolean(files.length < 3 || files.length > 9)}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
