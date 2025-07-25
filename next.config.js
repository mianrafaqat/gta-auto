module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  output: 'export',
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/product',
  //       permanent: true, // Set to true if the redirect is permanent
  //     },
  //   ];
  // },
};
