import { useMemo } from "react";

import { paths } from "src/routes/paths";

import { useTranslate } from "src/locales";
import { useAuthContext } from "src/auth/hooks";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import SvgColor from "src/components/svg-color";

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
  console.log("auth", auth);
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
            path: paths.dashboard.general.ecommerce,
            icon: ICONS.ecommerce,
            children: [
              {
                title: t("products"),
                path: paths.dashboard.product.root,
                icon: ICONS.product,
                children: [
                  { title: t("list"), path: paths.dashboard.product.root },
                  { title: t("create"), path: paths.dashboard.product.new },
                ],
              },
              {
                title: t("Categories"),
                path: paths.dashboard.category.root,
                icon: ICONS.product,
                children: [
                  { title: t("list"), path: paths.dashboard.category.list },
                  { title: t("create"), path: paths.dashboard.category.add },
                ],
              },
              {
                title: t("Attribute"),
                path: paths.dashboard.attribute.root,
                icon: ICONS.product,
                children: [
                  { title: t("list"), path: paths.dashboard.attribute.list },
                  { title: t("create"), path: paths.dashboard.attribute.add },
                ],
              },
              {
                title: t("Tax"),
                path: paths.dashboard.tax.root,
                icon: ICONS.tax,
                children: [
                  { title: t("list"), path: paths.dashboard.tax.list },
                  { title: t("create"), path: paths.dashboard.tax.add },
                ],
              },
              {
                title: t("Coupons"),
                path: paths.dashboard.coupon.root,
                icon: ICONS.coupon,
                children: [
                  { title: t("list"), path: paths.dashboard.coupon.list },
                  { title: t("create"), path: paths.dashboard.coupon.add },
                ],
              },
              {
                title: t("orders"),
                path: paths.dashboard.order.root,
                icon: ICONS.order,
                children: [
                  { title: t("list"), path: paths.dashboard.order.list },
                ],
              },
              {
                title: t("shipping"),
                path: paths.dashboard.shipping.root,
                icon: ICONS.shipping,
                children: [
                  {
                    title: t("methods"),
                    path: paths.dashboard.shipping.methods.root,
                  },
                  {
                    title: t("settings"),
                    path: paths.dashboard.shipping.settings,
                  },
                ],
              },
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
                roles: [ROLES.USER],
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
        ],
      },
    ],
    [t]
  );

  return data;
}
