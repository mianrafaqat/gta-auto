'use client';

/* eslint-disable perfectionist/sort-imports */
import '../global.css';

// Suppress known warnings from third-party libraries
import 'src/utils/suppress-warnings';

// i18n
import '../locales/i18n';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LocalizationProvider } from 'src/locales';

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider } from 'src/auth/context/jwt';
import { useEffect } from 'react';
import MainLayout from 'src/layouts/main';

// Component to handle mobile scroll-to-top
function MobileScrollHandler() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (!isMobile) return;

    // Ensure body is scrollable and can be scrolled to top
    // This enables the native "tap status bar to scroll to top" feature
    const setupMobileScroll = () => {
      // Ensure document and body can scroll
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
      document.body.style.minHeight = '100%';
      
      // Remove any fixed height constraints that might prevent scrolling
      const nextRoot = document.getElementById('__next');
      if (nextRoot) {
        nextRoot.style.minHeight = '100%';
      }
    };

    // Setup on mount
    setupMobileScroll();

    // Re-setup after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(setupMobileScroll, 100);

    // Also setup on window load
    window.addEventListener('load', setupMobileScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', setupMobileScroll);
    };
  }, []);

  return null;
}
// import { AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider } from 'src/auth/context/firebase';
// import { AuthProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={primaryFont.className}>
      <head>
        <meta name="google-site-verification" content="wF3dRaXdpca-BY45EI1zQ3un-YW-lLF4nlMmkextMYU" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MDFNSKMM');`,
          }}
        />
      </head>
      <body>
        <MobileScrollHandler />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LocalizationProvider>
              <SettingsProvider
                defaultSettings={{
                  themeMode: 'light', // 'light' | 'dark'
                  themeDirection: 'ltr', //  'rtl' | 'ltr'
                  themeContrast: 'default', // 'default' | 'bold'
                  themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                  themeStretch: false,
                }}
              >
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <CheckoutProvider>
                        <SettingsDrawer />
                        <ProgressBar />
                        {children}
                      </CheckoutProvider>
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </LocalizationProvider>
          </AuthProvider>
        </QueryClientProvider>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDFNSKMM"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>

      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};
