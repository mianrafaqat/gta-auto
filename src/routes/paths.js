import { paramCase } from "src/utils/change-case";

import { _id, _postTitles } from "src/_mock/assets";

// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS = {
  AUTH: "",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  components: "/components",
  docs: "https://docs.minimals.cc",
  changelog: "https://docs.minimals.cc/changelog",
  zoneUI: "https://mui.com/store/items/zone-landing-page/",
  minimalUI: "https://mui.com/store/items/minimal-dashboard/",
  freeUI: "https://mui.com/store/items/minimal-dashboard-free/",
  support: "/support",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  shippingPolicy: "/shipping-policy",
  cancellationRefundPolicy: "/cancellation-refund-policy",
  search: "/search",
  figma:
    "https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Steel-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0",
  product: {
    root: `/shop`,
    checkout: `/shop/checkout`,
    orderSuccess: `/shop/checkout/success`,
    details: (slug) => `/shop/${slug}`,
    demo: {
      details: `/shop/${_id[1]}`,
    },
  },
  trackOrder: "/track-order",
  orderDetail: (id) => `/track-order/order-detail/${id}`,
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(_postTitles[2])}`,
    },
  },
  blog: {
    root: `/blog`,
    details: (title) => `/blog/${paramCase(title)}`,
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: path(ROOTS.AUTH, "/login"),
      register: path(ROOTS.AUTH, "/register"),
      verify: path(ROOTS.AUTH, "/verify"),
      verifyReset: path(ROOTS.AUTH, "/verify-reset"),
      newPassword: path(ROOTS.AUTH, "/new-password"),
      forgotPassword: path(ROOTS.AUTH, "/forgot-password"),
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    trackOrder: `${ROOTS.DASHBOARD}/track-order`,
    orderDetail: (id) => `${ROOTS.DASHBOARD}/track-order/order-detail/${id}`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    // shipping: {
    //   root: `${ROOTS.DASHBOARD}/shipping/`,
    //   methods: {
    //     list: path(ROOTS.DASHBOARD, "/shipping/methods"),
    //     add: path(ROOTS.DASHBOARD, "/shipping/methods/add"),
    //   },
    //   settings: `${ROOTS.DASHBOARD}/shipping/settings`,
    // },

    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      forgotPassword: `/forgot-password`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${_id[1]}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${_id[1]}`,
        edit: `${ROOTS.DASHBOARD}/product/${_id[1]}/edit`,
      },
    },
    products: {
      root: `${ROOTS.DASHBOARD}/products`,
      new: `${ROOTS.DASHBOARD}/products/new`,
      details: (id) => `${ROOTS.DASHBOARD}/products/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/products/${id}/edit`,
      bySlug: (slug) => `${ROOTS.DASHBOARD}/products/slug/${slug}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/products/${_id[1]}`,
        edit: `${ROOTS.DASHBOARD}/products/${_id[1]}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${_id[1]}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${_id[1]}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(_postTitles[2])}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(_postTitles[2])}/edit`,
      },
    },

    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      list: `${ROOTS.DASHBOARD}/order`,
      my: `${ROOTS.DASHBOARD}/my-orders`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/order/${_id[1]}`,
      // },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${_id[1]}`,
        edit: `${ROOTS.DASHBOARD}/job/${_id[1]}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${_id[1]}`,
        edit: `${ROOTS.DASHBOARD}/tour/${_id[1]}/edit`,
      },
    },
    items: {
      root: `${ROOTS.DASHBOARD}/products`,
      create: `${ROOTS.DASHBOARD}/main`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/user-account`,
      list: `${ROOTS.DASHBOARD}/user-account/list`,
      create: `${ROOTS.DASHBOARD}/user-account/create`,
      edit: `${ROOTS.DASHBOARD}/user-account/edit`,
    },
    cars: {
      details: (carId) => `/cars/details?carId=${carId}`,
      all: "/cars/all",
      my: {
        root: `${ROOTS.DASHBOARD}/my-cars`,
        add: `${ROOTS.DASHBOARD}/my-cars/add`,
        list: `${ROOTS.DASHBOARD}/my-cars/list`,
        edit: (id) => `${ROOTS.DASHBOARD}/my-cars/edit?carId=${id}`,
      },
    },
    admin: {
      cars: {
        list: `${ROOTS.DASHBOARD}/admin/cars/list`,
        add: `${ROOTS.DASHBOARD}/admin/cars/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/admin/cars/edit?carId=${id}`,
      },
      users: {
        list: `${ROOTS.DASHBOARD}/admin/users/list`,
      },
      video: {
        list: path(ROOTS.DASHBOARD, "/admin/video/list"),
        view: (id) => `${ROOTS.DASHBOARD}/admin/video/${id}/view`,
        edit: (id) => `${ROOTS.DASHBOARD}/admin/video/${id}/edit`,
      },
      forum: {
        categories: `${ROOTS.DASHBOARD}/admin/forum/categories`,
        topics: `${ROOTS.DASHBOARD}/admin/forum/topics`,
      },
    },
    category: {
      root: `${ROOTS.DASHBOARD}/admin/categories/list`,
      list: path(ROOTS.DASHBOARD, "/admin/categories/list"),
      add: path(ROOTS.DASHBOARD, "/admin/categories/add"),
      edit: (id) => path(ROOTS.DASHBOARD, `/admin/categories/${id}/edit`),
    },
    attribute: {
      root: `${ROOTS.DASHBOARD}/admin/attribute/list`,
      list: path(ROOTS.DASHBOARD, "/admin/attribute/list"),
      add: path(ROOTS.DASHBOARD, "/admin/attribute/add"),
    },
    tax: {
      root: `${ROOTS.DASHBOARD}/admin/tax/list`,
      list: path(ROOTS.DASHBOARD, "/admin/tax/list"),
      add: path(ROOTS.DASHBOARD, "/admin/tax/add"),
    },
    coupon: {
      root: `${ROOTS.DASHBOARD}/admin/coupon/list`,
      list: path(ROOTS.DASHBOARD, "/admin/coupon/list"),
      add: path(ROOTS.DASHBOARD, "/admin/coupon/add"),
    },
    video: {
      root: path(ROOTS.DASHBOARD, "/video"),
      my: {
        root: path(ROOTS.DASHBOARD, "/video/my"),
        list: path(ROOTS.DASHBOARD, "/video/my/list"),
        add: path(ROOTS.DASHBOARD, "/video/my/add"),
        view: (id) => `${ROOTS.DASHBOARD}/video/my/${id}/view`,
        edit: (id) => `${ROOTS.DASHBOARD}/video/my/${id}/edit`,
      },
    },
    forum: {
      root: `${ROOTS.DASHBOARD}/forum`,
    },
  },
  user: {
    favourites: "/favourites",
  },
  cars: {
    root: "/cars",
  },
  rent: {
    root: "/rent",
  },
  guard: {
    root: "/guard",
  },
  category: {
    root: "/category",
    bySlug: (slug) => `/category/${slug}`,
  },
};
