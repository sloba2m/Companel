import type { User } from 'src/types/users';
import type { Message } from 'src/types/chat';
import type { Contact } from 'src/types/contacts';

import parse from 'html-react-parser';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Badge, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useMessage } from './hooks/use-message';

// ----------------------------------------------------------------------

type Props = {
  message: Message;
  contact?: Contact;
  onOpenLightbox: (value: string) => void;
  user: User;
};

export function ChatMessageItem({ message, contact, user, onOpenLightbox }: Props) {
  const theme = useTheme();

  const { me, senderDetails, hasImage } = useMessage({
    message,
    contact,
    currentUserId: `${user?.id}`,
  });

  const { fullName } = senderDetails;

  const { content, createdAt } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {`${me ? message.user?.fullName : fullName}, `}

      {fDateTime(createdAt)}
    </Typography>
  );

  const renderBody = (
    <Badge
    // badgeContent={
    //   message.note ? (
    //     <Tooltip title={message.note}>
    //       <IconButton disableTouchRipple sx={{ backgroundColor: theme.vars.palette.grey[300] }}>
    //         <Iconify
    //           icon="mdi:speaker-notes"
    //           width={16}
    //           sx={{ color: theme.vars.palette.grey[600] }}
    //         />
    //       </IconButton>
    //     </Tooltip>
    //   ) : (
    //     0
    //   )
    // }
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
            src={content}
            // onClick={() => onOpenLightbox(body)}
            onClick={() => console.log('open')}
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
          parse(content)
        )}
        {message.attachments.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {message.attachments.map((att) => (
              <a
                key={att.fileName}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    px: 1,
                    backgroundColor: theme.vars.palette.background.default,
                    borderRadius: 1,
                    color: theme.vars.palette.text.primary,
                    cursor: 'pointer',
                  }}
                >
                  <Iconify
                    icon="ic:baseline-insert-drive-file"
                    color={theme.vars.palette.text.primary}
                  />
                  <Typography variant="body2">{att.fileName}</Typography>
                </Box>
              </a>
            ))}
          </Box>
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
      {!me && (
        <Avatar alt={fullName} sx={{ width: 32, height: 32, mr: 2 }}>
          {contact?.name
            .split(' ')
            .map((word) => word[0])
            .join('')}
        </Avatar>
      )}

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
