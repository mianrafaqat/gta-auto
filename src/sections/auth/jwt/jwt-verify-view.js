'use client';

import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { EmailInboxIcon } from 'src/assets/icons';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import gtaAutosInstance from 'src/utils/requestInterceptor';

// ----------------------------------------------------------------------

export default function JwtVerifyView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');
  
  // Get userId from URL params
  const userId = searchParams.get('userId');

  const VerifySchema = Yup.object().shape({
    code: Yup.string()
      .required('Code is required')
      .matches(/^[0-9]{4}$/, 'Code must be exactly 4 digits'),
  });

  const defaultValues = {
    code: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const response = await gtaAutosInstance.post('/api/user/resend-otp', {
        userId,
      });

      if (response?.status === 200) {
        enqueueSnackbar(response?.data?.message || 'OTP resent successfully');
        // Start 60 seconds countdown
        setCountdown(60);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Failed to resend OTP', { variant: 'error' });
    } finally {
      setIsResending(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await gtaAutosInstance.post('/api/user/verify', {
        userId,
        otp: data.code,
      });

      if (response?.status === 200) {
        enqueueSnackbar(response?.data?.message || 'Email verified successfully');
        
        // Redirect to login page after successful verification
        const timeoutId = setTimeout(() => {
          router.push(paths.auth.jwt.login);
        }, 2000);

        // Cleanup timeout if component unmounts
        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.message || 'Verification failed');
      enqueueSnackbar(error?.message || 'Verification failed', { variant: 'error' });
    }
  });

  // If no userId is provided, redirect to login
  if (!userId) {
    // Use useEffect for client-side navigation
    useEffect(() => {
      router.push(paths.auth.jwt.login);
    }, [router]);
    return null;
  }

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFCode 
        name="code" 
        inputs={4}  // Set to 4 digits
        label="Enter OTP"
        sx={{ 
          '& .MuiTextField-root': {
            '& input': { textAlign: 'center' }
          }
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
      </LoadingButton>

      <Typography variant="body2" sx={{ mt: 2 }}>
        {`Don't have a code? `}
        {countdown > 0 ? (
          <Typography
            component="span"
            variant="subtitle2"
            sx={{ color: 'text.disabled' }}
          >
            Resend code in {countdown}s
          </Typography>
        ) : (
          <LoadingButton
            variant="text"
            size="small"
            loading={isResending}
            onClick={handleResendOTP}
            sx={{
              p: 0,
              m: 0,
              minHeight: 'auto',
              minWidth: 'auto',
              '&.MuiButton-text': { textDecoration: 'underline' }
            }}
          >
            Resend code
          </LoadingButton>
        )}
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We have emailed a 4-digit verification code to your email address.
          Please enter the code below to verify your email.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {renderForm}
    </FormProvider>
  );
}