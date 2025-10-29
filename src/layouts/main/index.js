'use client'
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { usePathname } from 'src/routes/hooks';

import Footer from './footer';
import Header from './header';
import MobileBottomNav from 'src/components/mobile-bottom-nav';

// ----------------------------------------------------------------------

export default function MainLayout({ children, hideFooter = false }) {
  const pathname = usePathname();

  const homePage = pathname === '/';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#000000',
      overflowX: 'hidden',
      // Ensure content can scroll on mobile
      position: 'relative',
      width: '100%',
    }}>
      <Header />

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#000000',
          ...(!homePage && {
            pt: { xs: 8, md: 10 },
          }),
          pb: { xs: '80px', md: 0 }, // Add padding bottom on mobile to prevent content being hidden by bottom nav
        }}
      >
        {children}
      </Box>

     {
      !hideFooter && (
        <Footer />
      )
     }

     {/* Mobile Bottom Navigation */}
     <MobileBottomNav />
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
