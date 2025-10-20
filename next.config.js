module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  async redirects() {
    return [
      // Redirect all demo auth pages to main login
      {
        source: '/auth/amplify/:path*',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/auth/auth0/:path*',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/auth/firebase/:path*',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/auth/supabase/:path*',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/auth-demo/:path*',
        destination: '/404',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        // Apply noindex to all auth pages to prevent indexing
        source: '/(login|register|forgot-password|reset-password|verify|verify-reset|new-password)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};
