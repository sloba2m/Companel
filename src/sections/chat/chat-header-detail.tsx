import type { IChatParticipant } from 'src/types/chat';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Button, TextField, Autocomplete } from '@mui/material';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ChatHeaderSkeleton } from './chat-skeleton';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  collapseMenuNav: UseNavCollapseReturn;
};

export function ChatHeaderDetail({ collapseNav, participants, loading, collapseMenuNav }: Props) {
  const popover = usePopover();

  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');
  const mdDown = useResponsive('down', 'md');

  const group = participants.length > 1;

  const singleParticipant = participants[0];

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const renderGroup = (
    <AvatarGroup max={3} sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
      {participants.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  const initials = singleParticipant?.name
    .split(' ')
    .map((word) => word[0])
    .join('');
  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2}>
      {smUp && <Avatar alt={singleParticipant?.name}>{initials}</Avatar>}

      <ListItemText primary={singleParticipant?.name} secondary="email@email.com" />
    </Stack>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  return (
    <>
      {mdDown && (
        <IconButton
          onClick={collapseMenuNav.onOpenMobile}
          sx={(theme) => ({
            mr: 2,
            backgroundColor: theme.vars.palette.primary.main,
            color: theme.vars.palette.primary.contrastText,
            '&:hover': { backgroundColor: theme.vars.palette.primary.darker },
          })}
        >
          <Iconify width={16} icon="solar:users-group-rounded-bold" />
        </IconButton>
      )}
      {group ? renderGroup : renderSingle}

      <Stack
        direction="row"
        flexGrow={1}
        justifyContent="flex-end"
        sx={{ gap: 2, flexWrap: 'wrap-reverse' }}
      >
        <Autocomplete
          sx={{ minWidth: '200px' }}
          options={['One guy', 'Other guy']}
          size="small"
          // getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} label="Assign" margin="none" />}
          // renderOption={(props, option) => (
          //   <li {...props} key={option.title}>
          //     {option.title}
          //   </li>
          // )}
        />

        <Button variant="soft" color="primary" size="medium">
          Resolve
        </Button>

        <Box sx={{ margin: 'auto 0' }}>
          <IconButton onClick={handleToggleNav} size="small">
            <Iconify
              width={24}
              icon="ic:baseline-arrow-back-ios-new"
              sx={{ transform: `rotate(${!collapseDesktop ? '180deg' : '0'})` }}
            />
          </IconButton>
        </Box>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:bell-off-bold" />
            Hide notifications
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:forbidden-circle-bold" />
            Block
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:danger-triangle-bold" />
            Report
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
