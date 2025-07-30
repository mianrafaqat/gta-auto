'use client';

import { VideoListView } from 'src/sections/admin/video/view';
import { RoleBasedGuard } from 'src/auth/guard';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';

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
            { name: 'Admin', href: paths.dashboard.admin.root },
            { name: 'Videos', href: paths.dashboard.admin.video.root },
            { name: 'List' },
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