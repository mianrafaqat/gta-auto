'use client';

import { useState, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { RoleBasedGuard } from 'src/auth/guard';

import AdminVideoListView from 'src/sections/video/view/admin-video-list-view';

// ----------------------------------------------------------------------

export default function AdminVideoListPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={['admin']}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="All Videos"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Video', href: paths.dashboard.video.root },
            { name: 'All Videos' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AdminVideoListView />
      </Container>
    </RoleBasedGuard>
  );
} 