'use client';

import { useState, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { RoleBasedGuard } from 'src/auth/guard';

import VideoListView from 'src/sections/video/view/video-list-view';

// ----------------------------------------------------------------------

export default function VideoListPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={['user', 'admin']}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="My Videos"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Video', href: paths.dashboard.video.root },
            { name: 'My Videos' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <VideoListView />
      </Container>
    </RoleBasedGuard>
  );
} 