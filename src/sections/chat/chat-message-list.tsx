import type { Contact } from 'src/types/contacts';

import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, Alert, Button, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { useGetMe } from 'src/actions/account';

import { Scrollbar } from 'src/components/scrollbar';

import { type Event, RevisionType, type Message } from 'src/types/chat';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  messages: Message[];
  events: Event[];
  contact?: Contact | null;
  fetchNextPage: () => void;
};

export function ChatMessageList({ messages = [], contact, loading, events, fetchNextPage }: Props) {
  const { t } = useTranslation();
  const { data: user, isLoading } = useGetMe();
  const router = useRouter();
  const location = useLocation();
  const { hash } = location;

  const historyFrom = hash.startsWith('#historyFrom=') ? hash.replace('#historyFrom=', '') : null;

  const handleReachedTop = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const { messagesEndRef } = useMessagesScroll(messages, handleReachedTop);

  const combinedList = useMemo(() => {
    const firstMessageDate = messages.length > 0 ? new Date(messages[0].createdAt) : null;

    const filteredEvents = events.filter((e) => {
      const eventDate = new Date(e.revisionTimestamp);
      return !firstMessageDate || eventDate >= firstMessageDate;
    });

    return [
      ...messages.map((m) => ({
        type: 'message' as const,
        date: new Date(m.createdAt),
        data: m,
      })),
      ...filteredEvents.map((e) => ({
        type: 'event' as const,
        date: new Date(e.revisionTimestamp),
        data: e,
      })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [messages, events]);

  const revisionTypeMessage = {
    [RevisionType.CREATED]: t('conversations.events.created'),
    [RevisionType.UPDATED]: t('conversations.events.updated'),
    [RevisionType.DELETED]: t('conversations.events.deleted'),
    [RevisionType.ASSIGNED]: t('conversations.events.assigned'),
    [RevisionType.UNASSIGNED]: t('conversations.events.unassigned'),
    [RevisionType.REASSIGNED]: t('conversations.events.reassigned'),
    [RevisionType.STATUS_UPDATE]: t('conversations.events.statusUpdate'),
  };

  // const slides = messages
  //   .filter((message) => message.contentType === 'image')
  //   .map((message) => ({ src: message.body }));

  // const lightbox = useLightBox(slides);

  if (loading || isLoading || !user) {
    return (
      <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: 'absolute',
          }}
        />
      </Stack>
    );
  }

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
        {combinedList.map((item, i) => {
          if (item.type === 'message') {
            return (
              <ChatMessageItem
                key={`message-${item.data.id}`}
                user={user}
                message={item.data}
                contact={contact}
                onOpenLightbox={() => console.log('images')}
              />
            );
          }

          if (item.type === 'event') {
            const task = item.data;
            return (
              <Box key={item.data.revisionTimestamp}>
                <Alert sx={{ maxWidth: '300px', ml: 'auto', my: 2 }} severity="info">
                  <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                    gridTemplateRows="repeat(4, auto)"
                    gap={1}
                  >
                    <Box>{revisionTypeMessage[task.revisionType]}</Box>
                    <Box>{`${fToNow(task.revisionTimestamp)} ago`}</Box>
                    <Box>{t('conversation.status.label')}</Box>
                    <Box>{task.status}</Box>
                    <Box>{t('conversation.assigneeIdLabel')}</Box>
                    <Box>{task.assigneeFullName}</Box>
                    <Box>{t('conversation.performedByAgent')}</Box>
                    <Box>{task.performedByFullName}</Box>
                  </Box>
                </Alert>
              </Box>
            );
          }

          return null;
        })}
      </Scrollbar>

      {historyFrom && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translate(-50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6">{t('inbox.previousConversation')}</Typography>
          <Button variant="contained" onClick={() => router.back()}>
            {t('inbox.goBack')}
          </Button>
        </Box>
      )}

      {/* <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      /> */}
    </>
  );
}
