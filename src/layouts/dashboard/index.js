import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import { useAuthContext } from 'src/auth/hooks';
import { Alert, Grid, Link } from '@mui/material';
import NextLink from 'next/link';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const auth = useAuthContext();

  const isAuthenticated = useMemo(() => {
    const userAccount = auth?.user?.user;
    if (userAccount?._id) {
      return true;
    }
    return false;
  }, [auth]);

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  // const alert = !isAuthenticated ? (
  //   <Grid mb={2} px={3}>
  //     <Alert severity="error" variant="filled">
  //       Your account is not authenticated.{' '}
  //       <Link
  //         component={NextLink}
  //         underline="always"
  //         color="primary.contrastText"
  //         href={paths.dashboard.seller.create}
  //       >
  //         Click here to connect your account with eBay.
  //       </Link>
  //     </Alert>
  //   </Grid>
  // ) : null;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>
          {/* {alert} */}
          {children}
        </Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>
            {alert} {children}
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>
          {alert} {children}
        </Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
