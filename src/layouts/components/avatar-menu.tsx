import type { SxProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

import { Menu, Avatar, MenuList, MenuItem, useTheme, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { useSettingsContext } from 'src/components/settings';

interface AvatarMenuProps {
  sx?: SxProps<Theme>;
}

export const AvatarMenu = ({ sx }: AvatarMenuProps) => {
  const popover = usePopover();
  const settings = useSettingsContext();
  const theme = useTheme();

  return (
    <>
      <IconButton onClick={popover.onOpen} sx={sx}>
        <Avatar sx={{ width: 48, height: 48, color: theme.palette.text.primary }}>US</Avatar>
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
            Settings
          </MenuItem>
          <MenuItem key="log out">
            <Iconify icon="ic:baseline-log-out" sx={{ mr: 1 }} />
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
