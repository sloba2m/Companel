import type { IChatMessage, IChatParticipant } from 'src/types/chat';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Badge, Tooltip, useTheme } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { useMessage } from './hooks/use-message';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  participants: IChatParticipant[];
  onOpenLightbox: (value: string) => void;
};

export function ChatMessageItem({ message, participants, onOpenLightbox }: Props) {
  const { user } = useMockedUser();
  const theme = useTheme();

  const { me, senderDetails, hasImage } = useMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { body, createdAt } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}

      {fDateTime(createdAt)}
    </Typography>
  );

  const renderBody = (
    <Badge
      badgeContent={
        message.note ? (
          <Tooltip title={message.note}>
            <IconButton disableTouchRipple sx={{ backgroundColor: theme.vars.palette.grey[300] }}>
              <Iconify
                icon="mdi:speaker-notes"
                width={16}
                sx={{ color: theme.vars.palette.grey[600] }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          0
        )
      }
    >
      <Stack
        sx={{
          p: 1.5,
          minWidth: 48,
          maxWidth: 320,
          borderRadius: 1,
          typography: 'body2',
          bgcolor: 'background.neutral',
          ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
          ...(hasImage && { p: 0, bgcolor: 'transparent' }),
        }}
      >
        {hasImage ? (
          <Box
            component="img"
            alt="attachment"
            src={body}
            onClick={() => onOpenLightbox(body)}
            sx={{
              width: 400,
              height: 'auto',
              borderRadius: 1.5,
              cursor: 'pointer',
              objectFit: 'cover',
              aspectRatio: '16/11',
              '&:hover': { opacity: 0.9 },
            }}
          />
        ) : (
          body
        )}
      </Stack>
    </Badge>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        position: 'absolute',
        transition: () =>
          theme.transitions.create(['opacity'], { duration: theme.transitions.duration.shorter }),
        ...(me && { right: 0, left: 'unset' }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="mdi:note" width={16} />
      </IconButton>
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent={me ? 'flex-end' : 'unset'}
      sx={{ mb: 5 }}
      key={message.id}
    >
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'}>
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{ position: 'relative', '&:hover': { '& .message-actions': { opacity: 1 } } }}
        >
          {renderBody}
          {renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}
