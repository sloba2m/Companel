import type { SxProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';

import { Menu, Avatar, MenuList, MenuItem, useTheme, IconButton } from '@mui/material';

import { getInitials } from 'src/utils/helper';
import getKeycloak from 'src/utils/keycloakService';

import { useGetMe } from 'src/actions/account';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { useSettingsContext } from 'src/components/settings';

interface AvatarMenuProps {
  sx?: SxProps<Theme>;
}

export const AvatarMenu = ({ sx }: AvatarMenuProps) => {
  const { t } = useTranslation();
  const popover = usePopover();
  const settings = useSettingsContext();
  const theme = useTheme();
  const keycloak = getKeycloak();
  const { data } = useGetMe();

  const initials = getInitials(data?.fullName);

  const onLogout = () => {
    keycloak.logout({
      redirectUri: import.meta.env.VITE_APP_DOMAIN,
    });
  };

  return (
    <>
      <IconButton onClick={popover.onOpen} sx={sx}>
        <Avatar sx={{ width: 48, height: 48, color: theme.palette.text.primary }}>
          {initials}
        </Avatar>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        open={!!popover.open}
      >
        <MenuList sx={{ width: 160, minHeight: 72 }}>
          <MenuItem
            key="Settings"
            onClick={() => {
              settings.onToggleDrawer();
              popover.onClose();
            }}
          >
            <Iconify icon="ic:baseline-settings" sx={{ mr: 1 }} />
            {t('settingsSubMenu.title')}
          </MenuItem>
          <MenuItem key="log out" onClick={onLogout}>
            <Iconify icon="ic:baseline-log-out" sx={{ mr: 1 }} />
            {t('settingsSubMenu.logOut')}
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
