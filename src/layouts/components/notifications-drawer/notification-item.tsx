import type { Notification } from 'src/types/notifications';

import i18next from 'i18next';
import parse from 'html-react-parser';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { fDateTime } from 'src/utils/format-time';

import { useReadNotification } from 'src/actions/notifications';

// ----------------------------------------------------------------------

const getMessage = (notification: Notification) => {
  if (notification.type === 'CONVERSATION_ASSIGNED') {
    const actor = notification.references.find((a) => a.keyword === 'actor');
    const conversation = notification.references.find((a) => a.keyword === 'conversation');

    return i18next.t('notifications.types.conversationAssigned', {
      name: actor?.referenceName,
      subject: conversation?.referenceName,
    });
  }
  if (notification.type === 'MESSAGE_IN_ASSIGNED_CONVERSATION') {
    const actor = notification.references.find((a) => a.keyword === 'actor');

    return i18next.t('notifications.types.messageInConversation', {
      name: actor?.referenceName,
    });
  }
  if (notification.type === 'CONVERSATION_UN_ASSIGNED') {
    const actor = notification.references.find((a) => a.keyword === 'actor');
    const conversation = notification.references.find((a) => a.keyword === 'conversation');

    return i18next.t('notifications.types.conversationUnAssigned', {
      name: actor?.referenceName,
      subject: conversation?.referenceName,
    });
  }

  return '';
};

export function NotificationItem({ notification }: { notification: Notification }) {
  const { mutate: readMutation } = useReadNotification();

  const renderText = (
    <ListItemText
      disableTypography
      secondary={
        <Stack direction="column" alignItems="start" sx={{ typography: 'caption', gap: 1 }}>
          <Box>{parse(getMessage(notification))}</Box>
          <Box>{fDateTime(notification.createdAt)}</Box>
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.isRead && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
      }}
      onClick={() => readMutation(notification.id)}
    >
      {renderUnReadBadge}

      <Stack sx={{ flexGrow: 1 }}>{renderText}</Stack>
    </ListItemButton>
  );
}
