import type { IChatConversation } from 'src/types/chat';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { clickConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { useNavItem } from './hooks/use-nav-item';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onCloseMobile: () => void;
  conversation: IChatConversation;
};

export function ChatNavItem({ selected, conversation, onCloseMobile }: Props) {
  const { user } = useMockedUser();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const { displayName, displayText, lastActivity } = useNavItem({
    conversation,
    currentUserId: `${user?.id}`,
  });

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      await clickConversation(conversation.id);

      router.push(`${paths.navigation.inbox}?id=${conversation.id}`);
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router]);

  return (
    <Box component="li" sx={{ display: 'flex' }}>
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
          badgeContent={conversation.unreadCount}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <Iconify width={24} icon="logos:facebook" />
        </Badge>

        <Box
          sx={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            // gap: 2,
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
              sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
            >
              {fToNow(lastActivity)}
            </Typography>
          </Box>
          <ListItemText
            sx={{ width: '100%' }}
            primary={displayName}
            primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
            secondary={displayText}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: conversation.unreadCount ? 'subtitle2' : 'body2',
              color: conversation.unreadCount ? 'text.primary' : 'text.secondary',
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip variant="soft" label="tag 1" size="small" />
              <Chip variant="soft" label="tag 2" size="small" />
            </Box>
            <Chip variant="outlined" label="Assigned" size="small" color="success" />
          </Box>

          {/* <Stack alignItems="flex-end" sx={{ alignSelf: 'stretch' }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
            >
              {fToNow(lastActivity)}
            </Typography>

            {!!conversation.unreadCount && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: 'info.main',
                  borderRadius: '50%',
                }}
              />
            )}
          </Stack> */}
        </Box>
      </ListItemButton>
    </Box>
  );
}
