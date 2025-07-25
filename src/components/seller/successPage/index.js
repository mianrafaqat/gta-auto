'use client';

import { AuthService } from 'src/services/auth/auth.service';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { m } from 'framer-motion';
import Alert from '@mui/material/Alert';
import { useAuthContext } from 'src/auth/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import CompactLayout from 'src/layouts/compact';
import { SeoIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
import { paths } from 'src/routes/paths';

const ACCOUNT_VERIFICATION_ERROR =
  'Your account could not be verified from ebay. Try refresh the page.';
const NO_USER_ID_ERROR = 'There is no ebay user ID associated with your account';
const ACCOUNT_VERIFICATION_SUCCESS = 'Your account has been verified successfully from ebay.';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('username');
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState(!userId ? NO_USER_ID_ERROR : null);
  const [account, setAccount] = useState(null);

  const auth = useAuthContext();
  const logout = auth.logout;

  useEffect(() => {
    const fetchToken = async ({ userId }) => {
      try {
        setLoading(true);
        const { data } = await AuthService.fetchTokenUsingGET({ userId });
        if (data && data.data) {
          setAccount(data.data);
        } else {
          setError(data.description || ACCOUNT_VERIFICATION_ERROR);
        }
      } catch (ex) {
        setError(ACCOUNT_VERIFICATION_ERROR);
        console.error(ex);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchToken({ userId });
    }
  }, [userId]);

  const handleLogin = async () => {
    await logout();
    router.replace(paths.auth.jwt.login);
  };

  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Ebay Account Verification
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Your ebay seller account verification is in progress. Please wait and don't close this
            page.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeoIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        {loading ||
          (!error && (
            <LoadingButton
              loading={loading}
              // component={RouterLink}
              onClick={handleLogin}
              // href="/auth/jwt/login/"
              size="large"
              variant="contained"
            >
              Login
            </LoadingButton>
          ))}

        {Boolean(error) && (
          <Alert severity="error" sx={{ width: 1 }}>
            {error}
          </Alert>
        )}

        {Boolean(!loading && !error) && (
          <Alert severity="success" sx={{ width: 1 }}>
            {ACCOUNT_VERIFICATION_SUCCESS}
          </Alert>
        )}
      </MotionContainer>
    </CompactLayout>
  );
}
