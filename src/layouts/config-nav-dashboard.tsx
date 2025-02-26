import SellTwoToneIcon from '@mui/icons-material/SellTwoTone';
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import ContactsTwoToneIcon from '@mui/icons-material/ContactsTwoTone';
import AllInboxTwoToneIcon from '@mui/icons-material/AllInboxTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import SummarizeTwoToneIcon from '@mui/icons-material/SummarizeTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Overview 6.0.0',
    items: [
      { title: 'Dashboard', path: paths.navigation.dashboard, icon: <DashboardTwoToneIcon /> },
      { title: 'Inbox', path: paths.navigation.inbox, icon: <InboxTwoToneIcon /> },
      { title: 'Contacts', path: paths.navigation.contacts, icon: <ContactsTwoToneIcon /> },
      { title: 'Customers', path: paths.navigation.customers, icon: <BusinessCenterTwoToneIcon /> },
      {
        title: 'Users Settings',
        path: paths.navigation.settings.users,
        icon: <ManageAccountsTwoToneIcon />,
      },
      {
        title: 'Inbox Settings',
        path: paths.navigation.settings.inbox,
        icon: <AllInboxTwoToneIcon />,
      },
      {
        title: 'Templates Settings',
        path: paths.navigation.settings.templates,
        icon: <SummarizeTwoToneIcon />,
      },
      { title: 'Tags Settings', path: paths.navigation.settings.tags, icon: <SellTwoToneIcon /> },
    ],
  },
];

// icon: <Iconify icon="solar:settings-bold-duotone" />,
