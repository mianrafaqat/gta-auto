'use client';

import { Container } from '@mui/system';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import SellerForm from './sellerForm';

export default function SellerCreatePage() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Connect account with eBay"
        links={[
          {
            name: 'Seller',
          },
          { name: 'Connect with eBay' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SellerForm />
    </Container>
  );
}
