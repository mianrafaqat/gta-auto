'use client';

import { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useSnackbar } from 'src/components/snackbar';
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form';
import { VideoService } from 'src/services';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const VideoSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  url: Yup.string().required('Video URL is required').url('Must be a valid URL'),
  description: Yup.string(),
  type: Yup.string().required('Type is required'),
});

const defaultValues = {
  title: '',
  url: '',
  description: '',
  type: 'youtube',
};

const VIDEO_TYPES = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'other', label: 'Other' },
];

// ----------------------------------------------------------------------

export default function VideoAddView() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { user } = useAuthContext();

  const methods = useForm({
    resolver: yupResolver(VideoSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Prepare video data
      const videoData = {
        title: data.title,
        url: data.url,
        type: data.type,
        description: data.description || '',
        userId: user?.user?._id,
      };

      // Call API to add video
      const response = await VideoService.addVideo(videoData);
      
      if (response?.status === 200) {
        snackbar.enqueueSnackbar('Video added successfully!');
        
        // Reset form
        reset();
        
        // Redirect to video list
        router.push(paths.dashboard.video.my.list);
      } else {
        throw new Error('Failed to add video');
      }
    } catch (error) {
      console.error(error);
      snackbar.enqueueSnackbar(
        error?.response?.data?.message || error.message || 'Failed to add video', 
        { variant: 'error' }
      );
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.video.my.list);
  }, [router]);

  return (
    <Container maxWidth={false}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add New Video
        </Typography>

        <FormProvider methods={methods}>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={3}>
              <RHFTextField
                name="title"
                label="Video Title"
                placeholder="Enter video title"
              />

              <RHFTextField
                name="url"
                label="Video URL"
                placeholder="https://www.youtube.com/watch?v=..."
                helperText="Enter the full URL of your video (YouTube, Vimeo, etc.)"
              />

              <RHFSelect name="type" label="Video Type">
                {VIDEO_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
                placeholder="Enter video description (optional)"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Add Video
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </FormProvider>
      </Card>
    </Container>
  );
} 