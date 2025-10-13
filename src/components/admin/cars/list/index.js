'use client';

import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import CarListTable from './car-list-table';
import { Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

export default function AdminCarListPage() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Cars List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Cars',
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.admin.cars.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add New Car
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <CarListTable />
    </Container>
  );
}
