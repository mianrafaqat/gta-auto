'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Container from '@mui/material/Container';
import { LoadingButton } from '@mui/lab';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { SellerService } from 'src/services';
import { idID } from '@mui/material/locale';

const schema = yup.object().shape({
  firstName: yup.string().required('Website URL is required'),
  lastName: yup.string().required('Website URL is required'),
  // ebayEmail: yup.string().email('Invalid email').required('Email is required'),
  // email: yup.string().email('Invalid email').required('Email is required'),
  websiteUrl: yup.string().url('Invalid URL format').required('Website URL is required'),
  address: yup.string(),
  bankName: yup.string(),
  bic: yup.string(),
  iban: yup.string(),
  ustIdNr: yup.string(),
  phone: yup.string(),
  kto: yup.string(),
});

const SellerEditForm = () => {
  const [loading, setLoading] = useState(false);
  const settings = useSettingsContext();
  const params = useSearchParams();
  const eBayUserName = params.get('eBayUserName');
  const sellerId = params.get('sellerId');
  const [sellerById, setSellerById] = useState({});
  console.log('🚀 ~ SellerEditForm ~ sellerById:', sellerById);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const handleGetSellerById = async (id) => {
    const response = await SellerService.getSellerById(id);
    if (response?.data?.status === '200') {
      setSellerById(response?.data?.data);
    } else {
      enqueueSnackbar(response?.data?.description);
    }
  };

  useEffect(() => {
    handleGetSellerById(eBayUserName);
  }, [eBayUserName]);

  const defaultValues = useMemo(() => {
    return {
      firstName: sellerById?.firstName || '',
      lastName: sellerById?.lastName || '',
      ebayEmail: sellerById?.ebayEmail || '',
      email: sellerById?.email || '',
      address: sellerById?.address || '',
      bankName: sellerById?.bankName || '',
      bic: sellerById?.bic || '',
      iban: sellerById?.iban || '',
      isAuthorised: sellerById?.isAuthorised,
      phone: sellerById?.phone || '',
      userId: sellerById?.userId || '',
      ustIdNr: sellerById?.ustIdNr || '',
      websiteUrl: sellerById?.websiteUrl || '',
      kto: sellerById?.kto || '',
    };
  }, [sellerById]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  useEffect(() => {
    // Reset the form with updated default values after user data is fetched
    methods.reset(defaultValues);
  }, [defaultValues]);
  const {
    handleSubmit,
    watch,
    formState: { isValid }, // Destructure isValid from formState
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    data = {
      ...data,
      ebayEmail: sellerById?.ebayEmail,
      email: sellerById?.email,
      userId: sellerId,
    };

    try {
      const response = await SellerService.updateSellerById(sellerId, data);
      if (response?.data?.status === '200') {
        enqueueSnackbar(response?.data?.description, { variant: 'success' });
        router.push(paths.dashboard.seller.list);
      } else {
        enqueueSnackbar(response?.data?.description, { variant: 'error' });
      }
    } catch (error) {}
  });

  const currentValues = watch();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Seller"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Seller' },
          { name: 'Edit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <RHFTextField label="First Name" name="firstName" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Last Name" name="lastName" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Address" name="address" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              label="Ebay Email *"
              name="ebayEmail"
              disabled
              value={sellerById?.ebayEmail || ''}
            />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Email *" name="email" disabled value={sellerById?.email || ''} />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Bank Name" name="bankName" />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="BIC" name="bic" />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="IBAN" name="iban" />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="KTO" name="kto" />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Phone" name="phone" />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="UserId" name="userId" disabled value={sellerById?.userId || ''} />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Ust-IdNr" name="ustIdNr" />
          </Grid>{' '}
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Website URL" name="websiteUrl" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'end' }}>
          <LoadingButton type="submit" variant="contained" disabled={!isValid} loading={loading}>
            Update
          </LoadingButton>
        </Box>
      </FormProvider>
    </Container>
  );
};

export default SellerEditForm;
