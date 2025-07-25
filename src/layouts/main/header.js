
'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { paths } from 'src/routes/paths';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Label from 'src/components/label';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import LoginButton from '../common/login-button';
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const {user = {}} = useAuthContext()?.user || {};

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.09) 0px 25px 20px -20px",
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,

          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container maxWidth="xl" sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
         
          <Logo />

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop data={navConfig} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {/* <Button variant="contained" target="_blank" rel="noopener" href={paths.minimalUI}>
              Purchase Now
            </Button> */}

            {mdUp && !Object.keys(user).length > 0 && <LoginButton />}
            {mdUp && Object.keys(user).length > 0 && <MoveTo title="Move to Dashboard" path={paths.dashboard.root} />}
            {mdUp && Object.keys(user).length > 0 && <MoveTo title="Favourite" path={paths.user.favourites} />}


            {/* <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            /> */}

            {!mdUp && <NavMobile data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}

function MoveTo({ sx, title, path }) {
  return (
    <Button href={path} variant="outlined" sx={{ mr: 1, ...sx }}>
      {title}
    </Button>
  );
}
