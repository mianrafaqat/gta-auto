'use client';

import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';

import { Box, Fab, Button, useTheme } from '@mui/material';
import { 
  HomeRounded, 
  CampaignRounded, 
  AddRounded, 
  ChatBubbleRounded, 
  MenuRounded 
} from '@mui/icons-material';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    title: 'Home',
    icon: HomeRounded,
    path: '/',
  },
  {
    title: 'My Ads',
    icon: CampaignRounded,
    path: paths.dashboard.cars.my.add,
  },
  {
    title: 'Sell',
    icon: AddRounded,
    path: '/cars',
    isFab: true,
  },
  {
    title: 'Chat',
    icon: ChatBubbleRounded,
    path: '/dashboard/chat',
  },
  {
    title: 'More',
    icon: MenuRounded,
    path: '/dashboard',
  },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#000',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1100,
        alignItems: 'center',
        justifyContent: 'space-around',
        px: 2,
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        const IconComponent = item.icon;

        if (item.isFab) {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                top: -10,
              }}
            >
              <Fab
                color="primary"
                size="medium"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  width: 56,
                  height: 56,
                  boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <IconComponent sx={{ fontSize: 28 }} />
              </Fab>
              <Box
                component="span"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  mt: 0.5,
                }}
              >
                {item.title}
              </Box>
            </Box>
          );
        }

        return (
          <Button
            key={item.title}
            onClick={() => handleNavigation(item.path)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 'auto',
              flex: 1,
              py: 1,
              px: 0,
              color: active ? theme.palette.primary.main : '#fff',
              '&:hover': {
                backgroundColor: 'transparent',
                color: theme.palette.primary.light,
              },
            }}
          >
            <IconComponent
              sx={{
                fontSize: 24,
                mb: 0.5,
                color: active ? theme.palette.primary.main : '#fff',
              }}
            />
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                textTransform: 'capitalize',
                color: active ? theme.palette.primary.main : '#fff',
              }}
            >
              {item.title}
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

MobileBottomNav.propTypes = {};

