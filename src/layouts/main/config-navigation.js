import { paths } from "src/routes/paths";

import { PATH_AFTER_LOGIN } from "src/config-global";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export const navConfig = [
  // {
  //   title: "Home",
  //   icon: <Iconify icon="solar:home-2-bold-duotone" />,
  //   path: "/",
  // },
  {
    title: "Garage",
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: "/cars",
  },
  {
    title: "Chemicals",
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: "/chemicals",
  },
  {
    title: "Shop",
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: "/product",
  },
  {
    title: "Services",
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: "/services",
  },
  {
    title: "Blog",
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: "/blog",
  },

  // {
  //   title: 'Components',
  //   icon: <Iconify icon="solar:atom-bold-duotone" />,
  //   path: paths.components,
  // },
  {
    title: "Others",
    path: "/pages",
    icon: <Iconify icon="solar:file-bold-duotone" />,
    children: [
      {
        subheader: "Other",
        items: [
          { title: "Support", path: paths.support },
          { title: "Privacy Policy", path: paths.privacyPolicy },
          { title: "Terms & Conditions", path: paths.termsAndConditions },
          { title: "Shipping Policy", path: paths.shippingPolicy },
          {
            title: "Cancellation & Refund Policy",
            path: paths.cancellationRefundPolicy,
          },
        ],
      },
    ],
  },
  // {
  //   subheader: "Concepts",
  //   items: [
  //     { title: "Shop", path: paths.product.root },
  //     { title: "Product", path: paths.product.demo.details },
  //     { title: "Checkout", path: paths.product.checkout },
  //     { title: "Posts", path: paths.post.root },
  //     { title: "Post", path: paths.post.demo.details },
  //   ],
  // },
  //     {
  //       subheader: 'Auth Demo',
  //       items: [
  //         { title: 'Login', path: paths.authDemo.classic.login },
  //         { title: 'Register', path: paths.authDemo.classic.register },
  //         {
  //           title: 'Forgot password',
  //           path: paths.authDemo.classic.forgotPassword,
  //         },
  //         { title: 'New password', path: paths.authDemo.classic.newPassword },
  //         { title: 'Verify', path: paths.authDemo.classic.verify },
  //         { title: 'Login (modern)', path: paths.authDemo.modern.login },
  //         { title: 'Register (modern)', path: paths.authDemo.modern.register },
  //         {
  //           title: 'Forgot password (modern)',
  //           path: paths.authDemo.modern.forgotPassword,
  //         },
  //         {
  //           title: 'New password (modern)',
  //           path: paths.authDemo.modern.newPassword,
  //         },
  //         { title: 'Verify (modern)', path: paths.authDemo.modern.verify },
  //       ],
  //     },
  //     {
  //       subheader: 'Error',
  //       items: [
  //         { title: 'Page 403', path: paths.page403 },
  //         { title: 'Page 404', path: paths.page404 },
  //         { title: 'Page 500', path: paths.page500 },
  //       ],
  //     },
  //     {
  //       subheader: 'Dashboard',
  //       items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
  //     },
  //   ],
  // },
  // {
  //   title: 'Docs',
  //   icon: <Iconify icon="solar:notebook-bold-duotone" />,
  //   path: paths.docs,
  // },
];
