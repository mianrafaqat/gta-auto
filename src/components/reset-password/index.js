'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

import { SeoIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
import { Box, Container, Grid, IconButton, InputAdornment } from '@mui/material';
import { useSettingsContext } from '../settings';
import { RHFTextField } from '../hook-form';

import * as Yup from 'yup';
import FormProvider from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserService } from 'src/services';
import { useSnackbar } from 'src/components/snackbar';
import CompactLayout from 'src/layouts/compact';
import { useSearchParams } from 'next/navigation';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from '../iconify/iconify';

const schema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues = {
  password: '',
  confirmPassword: '',
};

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const userId = params.get('userId');
  const token = params.get('token');

  const settings = useSettingsContext();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data = {
        ...data,
        userId,
        token,
      };
      setLoading(true);
      const res = await UserService.updatePassword(data);
      console.log('🚀 ~ onSubmit ~ res:', res);
      if (res?.data) {
        enqueueSnackbar(res?.data, {
          variant: 'success',
        });
      }
    } catch (e) {
      console.log('error: ', e);
      enqueueSnackbar(e || 'An unknown error occured!', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  });

  const password = useBoolean();
  const confirmPassword = useBoolean();

  return (
    <CompactLayout>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <MotionContainer>
          <Box
            sx={{
              position: 'absolute',
              top: '40%',
              left: '40%',
              transform: 'translate(-40%, -40%)',
            }}
          >
            <Grid alignItems="center" container spacing={5}>
              <Grid item xs={12} md={6}>
                <m.div variants={varBounce().in}>
                  <SeoIllustration
                    sx={{
                      height: 500,
                      // my: { xs: 5, sm: 10 },
                    }}
                  />
                </m.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <m.div variants={varBounce().in}>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                      Please reset your password
                    </Typography>
                  </m.div>
                  <m.div variants={varBounce().in}>
                    <RHFTextField
                      name="password"
                      label="Password"
                      type={password.value ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                              <Iconify
                                icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </m.div>
                  <m.div variants={varBounce().in}>
                    <RHFTextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type={confirmPassword.value ? 'text' : 'password'}
                      sx={{ mt: 1 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={confirmPassword.onToggle} edge="end">
                              <Iconify
                                icon={
                                  confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </m.div>
                  <m.div variants={varBounce().in}>
                    <LoadingButton
                      disabled={!isValid}
                      loading={loading}
                      sx={{ mt: 1, width: '100%' }}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Reset Password
                    </LoadingButton>
                  </m.div>
                </FormProvider>
              </Grid>
            </Grid>
          </Box>
        </MotionContainer>
      </Container>
    </CompactLayout>
  );
}
