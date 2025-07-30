import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const auth = useAuthContext();

  const isAuthenticated = useMemo(() => {
    const userAccount = auth?.user?.user;
    if (userAccount?._id) {
      return true;
    }
    return false;
  }, [auth]);
  // const userRole = useMemo(() => {
  //   const userAccount = auth?.user?.user;
  //   if (!userAccount) {
  //     return -1;
  //   } else {
  //     return userAccount.userAccountTypeId.toString();
  //   }
  // }, [auth]);

  const data = useMemo(
    () => [
      ...(isAuthenticated
        ? [
            {
              subheader: t('overview'),
              items: [
                {
                  title: t('app'),
                  path: paths.dashboard.root,
                  icon: ICONS.dashboard,
                },
              ],
            },
          ]
        : []),
      // OVERVIEW
      // ----------------------------------------------------------------------

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          //  SELLER
          ...(!isAuthenticated
            ? [
                {
                  title: 'Connect with eBay',
                  noTextTransform: true,
                  path: paths.dashboard.root,
                  icon: ICONS.external,
                },
              ]
            : [
                {
                  roles: [ROLES.USER, ROLES.ADMIN],
                  title: 'Cars',
                  path: paths.dashboard.users.root,
                  icon: ICONS.user,
                  children: [
                    { title: 'My', path: paths.dashboard.cars.my.list, roles: [ROLES.USER] },
                    {
                      title: 'Add',
                      path: paths.dashboard.cars.my.add,
                      roles: [ROLES.USER],
                    },
                    {
                      title: 'List',
                      path: paths.dashboard.admin.cars.list,
                      roles: [ROLES.ADMIN],
                    },
                  ],
                },
                {
                  roles: [ROLES.USER, ROLES.ADMIN],
                  title: 'Video',
                  path: paths.dashboard.video.root,
                  icon: ICONS.user,
                  children: [
                    { title: 'My', path: paths.dashboard.video.my.list, roles: [ROLES.USER, ROLES.ADMIN] },
                    {
                      title: 'Add',
                      path: paths.dashboard.video.my.add,
                      roles: [ROLES.USER, ROLES.ADMIN],
                    },
                    {
                      title: 'List',
                      path: paths.dashboard.admin.video.list,
                      roles: [ROLES.ADMIN],
                    },
                  ],
                },
                
                {
                  roles: [ROLES.ADMIN],
                  title: 'Users',
                  path: paths.dashboard.users.root,
                  icon: ICONS.user,
                  children: [
                    { title: 'List', path: paths.dashboard.admin.users.list, roles: [ROLES.ADMIN] },
                  ],
                },
              ]),
        ],
      },
    ],
    [t]
  );

  return data;
}
