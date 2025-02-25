import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Overview 6.0.0',
    items: [
      { title: 'Dashboard', path: paths.navigation.dashboard, icon: ICONS.dashboard },
      { title: 'Inbox', path: paths.navigation.inbox, icon: ICONS.chat },
      { title: 'Contacts', path: paths.navigation.contacts, icon: ICONS.user },
      { title: 'Customers', path: paths.navigation.customers, icon: ICONS.job },
      {
        title: 'Settings',
        path: paths.navigation.settings.root,
        icon: <Iconify icon="solar:settings-bold-duotone" />,
        children: [
          { title: 'Users', path: paths.navigation.settings.users },
          { title: 'Inbox', path: paths.navigation.settings.inbox },
          { title: 'Templates', path: paths.navigation.settings.templates },
          { title: 'Tags', path: paths.navigation.settings.tags },
        ],
      },
    ],
  },
];
