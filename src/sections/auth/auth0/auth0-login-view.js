'use client';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { validateRedirectUrl } from 'src/utils/redirect-validation';

// ----------------------------------------------------------------------

export default function Auth0LoginView() {
  const { loginWithRedirect, loginWithPopup } = useAuthContext();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const handleLoginWithPopup = useCallback(async () => {
    try {
      await loginWithPopup?.();
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  const handleRegisterWithPopup = useCallback(async () => {
    try {
      await loginWithPopup?.({
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  const handleLoginWithRedirect = useCallback(async () => {
    try {
      const safeRedirect = validateRedirectUrl(returnTo, PATH_AFTER_LOGIN);
      await loginWithRedirect?.({
        appState: {
          returnTo: safeRedirect,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithRedirect, returnTo]);

  const handleRegisterWithRedirect = useCallback(async () => {
    try {
      const safeRedirect = validateRedirectUrl(returnTo, PATH_AFTER_LOGIN);
      await loginWithRedirect?.({
        appState: {
          returnTo: safeRedirect,
        },
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithRedirect, returnTo]);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Sign in
      </Typography>

      <Stack spacing={2}>
        <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          onClick={handleLoginWithRedirect}
        >
          Login with Redirect
        </Button>

        <Button
          fullWidth
          color="primary"
          size="large"
          variant="soft"
          onClick={handleRegisterWithRedirect}
        >
          Register with Redirect
        </Button>

        <Divider />

        <Button
          fullWidth
          color="inherit"
          size="large"
          variant="contained"
          onClick={handleLoginWithPopup}
        >
          Login With Popup
        </Button>

        <Button
          fullWidth
          color="inherit"
          size="large"
          variant="soft"
          onClick={handleRegisterWithPopup}
        >
          Register With Popup
        </Button>
      </Stack>
    </>
  );
}
