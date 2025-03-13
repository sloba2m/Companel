import type { IChatParticipant } from 'src/types/chat';
import type { SnackbarCloseReason } from '@mui/material';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import {
  Box,
  Alert,
  Button,
  Snackbar,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material';

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

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

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
    <Stack direction="row" alignItems="center" spacing={2} mr={6}>
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

      <TextField
        placeholder="Search Chat"
        margin="none"
        size="small"
        sx={{ flexGrow: 10 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="ic:baseline-search" width={24} />
            </InputAdornment>
          ),
        }}
      />

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ gap: 2, flexWrap: 'wrap-reverse', flexGrow: 1 }}
      >
        <Autocomplete
          sx={{ minWidth: '200px' }}
          options={['One guy', 'Other guy']}
          size="small"
          disableCloseOnSelect
          // getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} label="Assign" margin="none" />}
          // renderOption={(props, option) => (
          //   <li {...props} key={option.title}>
          //     {option.title}
          //   </li>
          // )}
          onChange={() => handleClick()}
          renderOption={(props, option, { selected }) => {
            // eslint-disable-next-line react/prop-types
            const { key, ...optionProps } = props;

            return (
              <li key={key} {...optionProps}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  {option}
                  {selected && <Iconify icon="mdi:check" />}
                </Box>
              </li>
            );
          }}
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          User is assigned
        </Alert>
      </Snackbar>
    </>
  );
}
