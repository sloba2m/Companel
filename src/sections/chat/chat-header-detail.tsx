import type { User } from 'src/types/users';
import type { Conversation } from 'src/types/chat';
import type { SnackbarCloseReason } from '@mui/material';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
import { useDebouncedCallback } from 'src/routes/hooks/use-debounce';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { getInitials } from 'src/utils/helper';

import { useGetMe } from 'src/actions/account';
import { useGetUsers } from 'src/actions/users';
import { useAssignUser, useResolveConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ConversationStatus } from 'src/types/chat';

import { ChatHeaderSkeleton } from './chat-skeleton';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  conversation?: Conversation;
  collapseNav: UseNavCollapseReturn;
  collapseMenuNav: UseNavCollapseReturn;
  onChatSearch: (value: string) => void;
};

export function ChatHeaderDetail({
  collapseNav,
  conversation,
  loading,
  collapseMenuNav,
  onChatSearch,
}: Props) {
  const { t } = useTranslation();
  const popover = usePopover();
  const router = useRouter();

  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');
  const mdDown = useResponsive('down', 'md');

  const { value: yesNoOpen, onToggle: onYesNoToggle } = useBoolean(false);
  const [onYesCallback, setOnYesCallback] = useState<() => void>(() => () => {});

  const { data: users } = useGetUsers();
  const { data: me } = useGetMe();
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

  const [snackBar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({ message: '', open: false });
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onChatSearch(value);
  }, 300);

  if (loading || !conversation) {
    return <ChatHeaderSkeleton />;
  }

  const { contact } = conversation;

  const initials = getInitials(contact?.name);
  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2} mr={6}>
      {smUp && <Avatar alt={contact?.name}>{initials}</Avatar>}

      <ListItemText primary={contact?.name} secondary={contact.email} />
    </Stack>
  );

  const handleAssignUserMutation = (
    conversationId: string,
    action: 'assign' | 'unassign',
    userId: string,
    onSuccess?: () => void
  ) => {
    assignUserMutation({ conversationId, action, userId }, { onSuccess });
  };

  const assignUser = (user: User) => {
    if (!conversation?.id) return;

    const assign = () =>
      handleAssignUserMutation(conversation.id, 'assign', user.id, () => {
        setSnackbar({ message: 'User is assigned', open: true });
        router.push(
          `${paths.navigation.inbox}&id=${conversation.inboxId}&conversationId=${conversation.id}`
        );
      });

    if (conversation.assignee)
      handleAssignUserMutation(conversation.id, 'unassign', conversation.assignee.id, assign);
    else assign();
  };

  const unassignUser = () => {
    if (!conversation?.id || !conversation.assignee) return;

    handleAssignUserMutation(conversation.id, 'unassign', conversation.assignee.id, () => {
      setSnackbar({ message: 'User is unassigned', open: true });
      router.push(
        `${paths.navigation.inbox}&id=${conversation.inboxId}&conversationId=${conversation.id}`
      );
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

  const isResolved = conversation.status === ConversationStatus.RESOLVED;

  const sortedUsers = users?.slice().sort((a, b) => {
    if (a.id === me?.id) return -1;
    if (b.id === me?.id) return 1;
    return 0;
  });

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
        placeholder={t('conversations.new.searchChat')}
        margin="none"
        size="small"
        sx={{ flexGrow: 10 }}
        onChange={(e) => debouncedSearch(e.target.value)}
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
        sx={{ gap: 2, flexWrap: 'wrap-reverse', flexGrow: 1, alignItems: 'center' }}
      >
        <Autocomplete
          sx={{ minWidth: '200px' }}
          options={sortedUsers ?? []}
          size="small"
          value={conversation.assignee}
          getOptionLabel={(option) => option.fullName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} label={t('conversations.assignTo')} margin="none" size="small" />
          )}
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
            const isMe = option.id === me?.id;

            return (
              <li key={key} {...optionProps}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  {isMe ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="mdi:hand-back-left" />
                      {t('conversations.assignToMe')}
                    </Box>
                  ) : (
                    option.fullName
                  )}
                  {selected && <Iconify icon="mdi:check" />}
                </Box>
              </li>
            );
          }}
        />

        <Button
          variant="soft"
          color="primary"
          size="small"
          disabled={isResolved}
          onClick={() => openYesNoDialog(() => handleResolveConfirm())}
        >
          {isResolved ? t('conversations.resolve.resolved') : t('conversations.resolve.resolve')}
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
      <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackBar.message}
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
