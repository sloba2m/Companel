import type { User } from 'src/types/users';
import type { Conversation } from 'src/types/chat';
import type { SnackbarCloseReason } from '@mui/material';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import {
  Box,
  Alert,
  Button,
  Snackbar,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useGetUsers } from 'src/actions/users';
import { useAssignUser, useResolveConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ChatHeaderSkeleton } from './chat-skeleton';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  conversation?: Conversation;
  collapseNav: UseNavCollapseReturn;
  collapseMenuNav: UseNavCollapseReturn;
};

export function ChatHeaderDetail({ collapseNav, conversation, loading, collapseMenuNav }: Props) {
  const popover = usePopover();
  const router = useRouter();

  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');
  const mdDown = useResponsive('down', 'md');

  const { value: yesNoOpen, onToggle: onYesNoToggle } = useBoolean(false);
  const [onYesCallback, setOnYesCallback] = useState<() => void>(() => () => {});

  const { data: users } = useGetUsers();
  const { mutate: assignUserMutation } = useAssignUser();
  const { mutate: resolveMutation } = useResolveConversation();

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const openYesNoDialog = (callback: () => void) => {
    setOnYesCallback(() => callback);
    onYesNoToggle();
  };

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const [open, setOpen] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (loading || !conversation) {
    return <ChatHeaderSkeleton />;
  }

  const { contact } = conversation;

  const initials = contact?.name
    .split(' ')
    .map((word) => word[0])
    .join('');
  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2} mr={6}>
      {smUp && <Avatar alt={contact?.name}>{initials}</Avatar>}

      <ListItemText primary={contact?.name} secondary="email@email.com" />
    </Stack>
  );

  const assignUser = (user: User) => {
    if (conversation.assignee) {
      assignUserMutation(
        {
          conversationId: conversation?.id,
          action: 'unassign',
          userId: conversation.assignee?.id,
        },
        {
          onSuccess: () =>
            assignUserMutation({
              conversationId: conversation?.id,
              action: 'assign',
              userId: user.id,
            }),
        }
      );
    } else {
      assignUserMutation({
        conversationId: conversation?.id,
        action: 'assign',
        userId: user.id,
      });
    }
  };

  const unassignUser = () => {
    if (!conversation.assignee) return;
    assignUserMutation({
      conversationId: conversation?.id,
      action: 'unassign',
      userId: conversation.assignee?.id,
    });
  };

  const handleResolveConfirm = () => {
    if (conversation?.id)
      resolveMutation(conversation?.id, {
        onSuccess: () => {
          router.push(`${paths.navigation.inbox}&id=${conversation.inboxId}`);
        },
      });
  };

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
      {renderSingle}

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
          options={users ?? []}
          size="small"
          value={conversation.assignee}
          getOptionLabel={(option) => option.fullName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Assign" margin="none" />}
          onChange={(_e, _v, reason, details) => {
            if (!details?.option) return;
            if (reason === 'selectOption') openYesNoDialog(() => assignUser(details.option));
          }}
          onInputChange={(_e, inputValue, reason) => {
            if (reason === 'clear') openYesNoDialog(() => unassignUser());
          }}
          renderOption={(props, option, { selected }) => {
            // eslint-disable-next-line react/prop-types
            const { key, ...optionProps } = props;

            return (
              <li key={key} {...optionProps}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  {option.fullName}
                  {selected && <Iconify icon="mdi:check" />}
                </Box>
              </li>
            );
          }}
        />

        <Button
          variant="soft"
          color="primary"
          size="medium"
          onClick={() => openYesNoDialog(() => handleResolveConfirm())}
        >
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

      <YesNoDialog
        onClose={onYesNoToggle}
        open={yesNoOpen}
        onYes={() => {
          onYesCallback();
          onYesNoToggle();
        }}
      />
    </>
  );
}
