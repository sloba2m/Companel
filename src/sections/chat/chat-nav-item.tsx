import type { Conversation } from 'src/types/chat';

import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

import { AssignedStatus, ConversationStatus } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onCloseMobile: () => void;
  conversation: Conversation;
  odd: boolean;
};

export function ChatNavItem({ selected, conversation, onCloseMobile, odd }: Props) {
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }
      const params = new URLSearchParams(searchParams.toString());

      params.set('conversationId', conversation.id);
      router.push(`${paths.navigation.inboxBase}?${params.toString()}`);
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router, searchParams]);

  const assignedStatus: AssignedStatus = useMemo(() => {
    if (conversation.status === ConversationStatus.RESOLVED) {
      return AssignedStatus.RESOLVED;
    }
    return conversation.assignee ? AssignedStatus.ASSIGNED : AssignedStatus.UNASSIGNED;
  }, [conversation.status, conversation.assignee]);

  const assignedColor = useMemo(() => {
    const statusToColorMap: Record<AssignedStatus, 'info' | 'success' | 'error'> = {
      [AssignedStatus.ASSIGNED]: 'info',
      [AssignedStatus.RESOLVED]: 'success',
      [AssignedStatus.UNASSIGNED]: 'error',
    };

    return statusToColorMap[assignedStatus];
  }, [assignedStatus]);

  return (
    <Box
      component="li"
      sx={(theme) => ({
        display: 'flex',
        borderBottom: `solid 1px ${theme.palette.divider}`,
        backgroundColor: odd
          ? varAlpha(theme.palette.background.neutralChannel, 0.3)
          : theme.palette.background.paper,
      })}
    >
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          alignItems: 'flex-start',
          py: 1.5,
          px: 2.5,
          gap: 1,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={conversation.unreadMessages}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <Iconify
            width={24}
            icon={conversation.channelType === 'EMAIL' ? 'logos:google-gmail' : 'ic:round-widgets'}
          />
        </Badge>

        <Box
          sx={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography>Facebook</Typography>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{ fontSize: 12, color: 'text.disabled' }}
            >
              {fDate(conversation.lastContactActivity)}
            </Typography>
          </Box>
          <ListItemText
            sx={{ width: '100%' }}
            primary={conversation.contact.name}
            primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
            secondary={conversation.subject}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: conversation.unreadMessages ? 'subtitle2' : 'body2',
              color: conversation.unreadMessages ? 'text.primary' : 'text.secondary',
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {conversation.tags.map((tag) => (
                <Chip key={tag.id} variant="soft" label={tag.name} size="small" />
              ))}
            </Box>
            <Chip variant="outlined" label={assignedStatus} size="small" color={assignedColor} />
          </Box>
        </Box>
      </ListItemButton>
    </Box>
  );
}
