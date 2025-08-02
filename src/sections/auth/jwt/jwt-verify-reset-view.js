'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { SentIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import gtaAutosInstance from 'src/utils/requestInterceptor';

// ----------------------------------------------------------------------

export default function JwtVerifyResetView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();
  
  // Get email and token from URL params
  const email = searchParams?.get('email');
  const resetToken = searchParams?.get('token');

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await gtaAutosInstance.post('/api/user/update-password', {
        email,
        resetToken,
        newPassword: data.password,
      });

      if (response?.status === 200) {
        enqueueSnackbar(response?.data?.message || 'Password updated successfully');
        router.push(paths.auth.jwt.login);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.message || 'Failed to update password');
      enqueueSnackbar(error?.message || 'Failed to update password', { variant: 'error' });
    }
  });

  // If no email or token is provided, redirect to forgot password
  if (!email || !resetToken) {
    router.push(paths.auth.jwt.forgotPassword);
    return null;
  }

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="password"
        label="New Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        helperText="Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers and special characters"
      />

      <RHFTextField
        name="confirmPassword"
        label="Confirm New Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Update Password
      </LoadingButton>

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
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Set New Password</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter your new password below.
          <br />
          Make sure it's secure and you remember it.
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