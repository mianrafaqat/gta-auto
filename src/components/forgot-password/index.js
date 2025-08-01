'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

import { SeoIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
import { Box, Container, Grid } from '@mui/material';
import { useSettingsContext } from '../settings';
import { RHFTextField } from '../hook-form';

import * as Yup from 'yup';
import FormProvider from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserService } from 'src/services';
import { useSnackbar } from 'src/components/snackbar';
import CompactLayout from 'src/layouts/compact';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  captchaResponse: Yup.string(),
});

const defaultValues = {
  email: '',
  captchaResponse: 'dummy text',
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await UserService.forgotPassword(data);

      if (res?.data) {
        enqueueSnackbar(res?.data, {
          variant: 'success',
        });
        router.push(paths.auth.jwt.verifyReset + `?email=${data.email}`);
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
                      Forgot Password?
                    </Typography>
                  </m.div>

                  <m.div variants={varBounce().in}>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Please enter your email to reset your password
                    </Typography>
                  </m.div>
                  <m.div variants={varBounce().in}>
                    <RHFTextField name="email" label="Email" sx={{ mt: 2, width: '100%' }} />
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
