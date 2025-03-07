import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  {
    items: [
      {
        title: 'Dashboard',
        path: paths.navigation.dashboard,
        icon: <Iconify icon="ic:twotone-dashboard" />,
      },
      { title: 'Inbox', path: paths.navigation.inbox, icon: <Iconify icon="ic:twotone-inbox" /> },
      {
        title: 'Contacts',
        path: paths.navigation.contacts,
        icon: <Iconify icon="ic:twotone-contacts" />,
      },
      {
        title: 'Customers',
        path: paths.navigation.customers,
        icon: <Iconify icon="ic:twotone-business-center" />,
      },
      {
        title: 'Settings',
        path: paths.navigation.settings.root,
        icon: <Iconify icon="ic:twotone-settings" />,
        children: [
          {
            title: 'Users',
            path: paths.navigation.settings.users,
            icon: <Iconify icon="ic:twotone-people-alt" />,
          },
          {
            title: 'Inbox',
            path: paths.navigation.settings.inbox,
            icon: <Iconify icon="ic:twotone-all-inbox" />,
          },
          {
            title: 'Templates',
            path: paths.navigation.settings.templates,
            icon: <Iconify icon="ic:twotone-summarize" />,
          },
          {
            title: 'Tags',
            path: paths.navigation.settings.tags,
            icon: <Iconify icon="ic:twotone-sell" />,
          },
        ],
      },
    ],
  },
];
