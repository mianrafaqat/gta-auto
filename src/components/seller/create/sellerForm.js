import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { SellerService } from 'src/services';
import { Alert } from '@mui/material';

// ----------------------------------------------------------------------

export default function SellerForm({ seller }) {
  const [alertInfo, setAlertInfo] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const sellerSchema = Yup.object().shape({
    name: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = useMemo(
    () => ({
      name: seller?.name || '',
      email: seller?.email || '',
    }),
    [seller]
  );

  const methods = useForm({
    resolver: yupResolver(sellerSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const handleClose = () => setAlertInfo(null);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await SellerService.createSeller({
        eBayUserName: values?.name,
        email: values?.email,
      });
      if (response?.data?.data) {
        setAlertInfo({
          severity: 'success',
          message: 'An eBay connect link has been sent to your email.',
        });
        reset();
      } else {
        setAlertInfo({ severity: 'error', message: 'Something went wrong! Please try again.' });
      }
    } catch (error) {
      setAlertInfo({ severity: 'error', message: 'Something went wrong! Please try again.' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {alertInfo && (
        <Alert
          severity={alertInfo.severity}
          sx={{ mb: 1 }}
          onClose={alertInfo.severity === 'error' ? handleClose : null}
        >
          {alertInfo.message}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="eBay Username" />
              <RHFTextField name="email" label="Email Address" />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isValid}
                loading={isSubmitting}
              >
                {!seller ? 'Connect with eBay' : 'Please wait...'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SellerForm.propTypes = {
  seller: PropTypes.object,
};
