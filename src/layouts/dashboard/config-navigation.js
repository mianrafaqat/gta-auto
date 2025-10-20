import { useMemo } from "react";

import { paths } from "src/routes/paths";

import { useTranslate } from "src/locales";
import { useAuthContext } from "src/auth/hooks";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import SvgColor from "src/components/svg-color";
import CategoryIcon from "@mui/icons-material/Category";
import AttributionIcon from "@mui/icons-material/Attribution";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  job: icon("ic_job"),
  blog: icon("ic_blog"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  tour: icon("ic_tour"),
  order: icon("ic_order"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  product: icon("ic_product"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
  shipping: icon("ic_shipping"),
  tax: icon("ic_tax"),
  coupon: icon("ic_coupon"),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const auth = useAuthContext();
  const isAuthenticated = useMemo(() => {
    const userAccount = auth?.authenticated;
    if (userAccount) {
      return true;
    }
    return false;
  }, [auth]);

  const data = useMemo(
    () => [
      ...(isAuthenticated
        ? [
            {
              subheader: t("overview"),
              items: [
                {
                  title: t("app"),
                  path: paths.dashboard.root,
                  icon: ICONS.dashboard,
                },
              ],
            },
          ]
        : []),

      // MANAGEMENT
      {
        subheader: t("management"),

        items: [
          // ECOMMERCE
          {
            title: t("ecommerce"),
            roles: [ROLES.ADMIN],
            path: paths.dashboard.general.ecommerce,
            icon: ICONS.ecommerce,
            children: [
              {
                title: t("products"),
                roles: [ROLES.ADMIN],
                path: paths.dashboard.product.root,
                icon: ICONS.product,
                children: [
                  { title: t("list"), path: paths.dashboard.product.root },
                  { title: t("create"), path: paths.dashboard.product.new },
                ],
              },
              {
                title: t("Categories"),
                roles: [ROLES.ADMIN],
                path: paths.dashboard.category.root,
                icon: <CategoryIcon />,
                children: [
                  { title: t("list"), path: paths.dashboard.category.list },
                  { title: t("create"), path: paths.dashboard.category.add },
                ],
              },
              {
                title: t("Attribute"),
                roles: [ROLES.ADMIN],
                path: paths.dashboard.attribute.root,
                icon: <AttributionIcon />,
                children: [
                  {
                    title: t("list"),
                    path: paths.dashboard.attribute.list,
                    roles: [ROLES.ADMIN],
                  },
                  { title: t("create"), path: paths.dashboard.attribute.add },
                ],
              },
              {
                title: t("Tax"),
                roles: [ROLES.ADMIN],
                path: paths.dashboard.tax.root,
                icon: <ReceiptIcon />,
                children: [
                  {
                    title: t("list"),
                    path: paths.dashboard.tax.list,
                    roles: [ROLES.ADMIN],
                  },
                  { title: t("create"), path: paths.dashboard.tax.add },
                ],
              },
              {
                title: t("Coupons"),
                roles: [ROLES.ADMIN],
                path: paths.dashboard.coupon.root,
                icon: <DiscountIcon />,
                children: [
                  {
                    title: t("list"),
                    path: paths.dashboard.coupon.list,
                    roles: [ROLES.ADMIN],
                  },
                  { title: t("create"), path: paths.dashboard.coupon.add },
                ],
              },
              {
                title: t("orders"),
                path: paths.dashboard.order.root,
                icon: ICONS.order,
                children: [
                  {
                    title: t("list"),
                    path: paths.dashboard.order.list,
                    roles: [ROLES.ADMIN],
                  },
                  // { title: t("My Orders"), path: paths.dashboard.order.new, roles: [ROLES.USER] },
                ],
              },

              // {
              //   title: t("shipping"),
              //   path: paths.dashboard.shipping.root,
              //   icon: <LocalShippingIcon />,
              //   children: [
              //     {
              //       title: t("methods"),
              //       path: paths.dashboard.shipping.methods.root,
              //     },
              //     {
              //       title: t("settings"),
              //       path: paths.dashboard.shipping.settings,
              //     },
              //   ],
              // },
            ],
          },
          // Cars section
          {
            roles: [ROLES.USER, ROLES.ADMIN],
            title: "Cars",
            path: paths.dashboard.users.root,
            icon: ICONS.user,
            children: [
              {
                title: "My",
                path: paths.dashboard.cars.my.list,
                roles: [ROLES.USER],
              },
              {
                title: "Add",
                path: paths.dashboard.cars.my.add,
                roles: [ROLES.USER, ROLES.ADMIN],
              },
              {
                title: "List",
                path: paths.dashboard.admin.cars.list,
                roles: [ROLES.ADMIN],
              },
            ],
          },
          // Video section
          {
            roles: [ROLES.ADMIN],
            title: "Video",
            path: paths.dashboard.video.root,
            icon: ICONS.user,
            children: [
              {
                title: "My",
                path: paths.dashboard.video.my.list,
                roles: [ROLES.USER, ROLES.ADMIN],
              },
              {
                title: "Add",
                path: paths.dashboard.video.my.add,
                roles: [ROLES.USER, ROLES.ADMIN],
              },
              {
                title: "List",
                path: paths.dashboard.admin.video.list,
                roles: [ROLES.ADMIN],
              },
            ],
          },
          // Users section
          {
            roles: [ROLES.ADMIN],
            title: "Users",
            path: paths.dashboard.users.root,
            icon: ICONS.user,
            children: [
              {
                title: "List",
                path: paths.dashboard.admin.users.list,
                roles: [ROLES.ADMIN],
              },
            ],
          },

          {
            roles: [ROLES.ADMIN],
            title: "Blog",
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
            children: [
              {
                title: "List",
                path: paths.dashboard.post.root,
                roles: [ROLES.ADMIN],
              },
              {
                title: "Details",
                path: paths.dashboard.post.demo.details,
                roles: [ROLES.ADMIN],
              },
              {
                title: "Create",
                path: paths.dashboard.post.new,
                roles: [ROLES.ADMIN],
              },
             
            ],
          },
          // Forum section
          {
            roles: [ROLES.ADMIN],
            title: "Forum",
            path: paths.dashboard.forum.root,
            icon: ICONS.blog,
            children: [
              {
                title: "Categories",
                path: paths.dashboard.admin.forum.categories,
                roles: [ROLES.ADMIN],
              }
            ],
          },
          {
            roles: [ROLES.USER],
            title: "Orders",
            path: paths.dashboard.order.root,

            icon: ICONS.order,
            children: [
              // { title: "List", path: paths.dashboard.order.list, },
              { title: "My Orders", path: paths.dashboard.order.my, roles: [ROLES.USER] },
            ],
          },

          {
            roles: [ROLES.USER],
            title: "Track Order",
            path: paths.dashboard.trackOrder,
            icon: ICONS.order,
            children: [
              // { title: "List", path: paths.dashboard.order.list, },
              { title: "Track Order", path: paths.dashboard.trackOrder, roles: [ROLES.USER] },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
