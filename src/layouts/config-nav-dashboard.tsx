import i18next from 'i18next';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  {
    items: [
      {
        title: i18next.t('navigation.dashboard'),
        path: paths.navigation.dashboard,
        icon: <Iconify icon="ic:twotone-dashboard" />,
      },
      {
        title: i18next.t('navigation.inbox'),
        path: paths.navigation.inbox,
        icon: <Iconify icon="ic:twotone-inbox" />,
      },
      {
        title: i18next.t('navigation.contacts'),
        path: paths.navigation.contacts,
        icon: <Iconify icon="ic:twotone-contacts" />,
      },
      {
        title: i18next.t('navigation.customers'),
        path: paths.navigation.customers,
        icon: <Iconify icon="ic:twotone-business-center" />,
      },
      {
        title: i18next.t('navigation.settings'),
        path: paths.navigation.settings.root,
        icon: <Iconify icon="ic:twotone-settings" />,
        children: [
          {
            title: i18next.t('navigation.users'),
            path: paths.navigation.settings.users,
            icon: <Iconify icon="ic:twotone-people-alt" />,
          },
          {
            title: i18next.t('navigation.inbox'),
            path: paths.navigation.settings.inbox,
            icon: <Iconify icon="ic:twotone-all-inbox" />,
          },
          {
            title: i18next.t('navigation.templates'),
            path: paths.navigation.settings.templates,
            icon: <Iconify icon="ic:twotone-summarize" />,
          },
          {
            title: i18next.t('navigation.tags'),
            path: paths.navigation.settings.tags,
            icon: <Iconify icon="ic:twotone-sell" />,
          },
        ],
      },
    ],
  },
];
