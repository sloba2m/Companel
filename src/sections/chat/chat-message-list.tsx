import type { Message } from 'src/types/chat';
import type { Contact } from 'src/types/contacts';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { useGetMeCached } from 'src/actions/account';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  messages: Message[];
  contact?: Contact;
  fetchNextPage: () => void;
};

export function ChatMessageList({ messages = [], contact, loading, fetchNextPage }: Props) {
  const { data: user, isLoading } = useGetMeCached();

  const handleReachedTop = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const { messagesEndRef } = useMessagesScroll(messages, handleReachedTop);

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
  /* {i === messages.length - 1 && (
              <Box key={`${message.id}status`}>
                <Alert sx={{ maxWidth: '300px', ml: 'auto', my: 2 }} severity="info">
                  Created: 9:20
                </Alert>
              </Box>
            )} */
  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
        {messages.map((message, i) => (
          <ChatMessageItem
            key={message.id}
            user={user}
            message={message}
            contact={contact}
            // onOpenLightbox={() => lightbox.onOpen(message.body)}
            onOpenLightbox={() => console.log('images')}
          />
        ))}
      </Scrollbar>

      {/* <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      /> */}
    </>
  );
}
