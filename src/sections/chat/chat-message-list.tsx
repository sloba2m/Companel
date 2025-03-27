import type { Message } from 'src/types/chat';
import type { Contact } from 'src/types/contacts';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  messages: Message[];
  contact?: Contact;
};

export function ChatMessageList({ messages = [], contact, loading }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  // const slides = messages
  //   .filter((message) => message.contentType === 'image')
  //   .map((message) => ({ src: message.body }));

  // const lightbox = useLightBox(slides);

  if (loading) {
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
        {messages.map((message, i) => (
          <>
            {/* {i === messages.length - 1 && (
              <Box key={`${message.id}status`}>
                <Alert sx={{ maxWidth: '300px', ml: 'auto', my: 2 }} severity="info">
                  Created: 9:20
                </Alert>
              </Box>
            )} */}
            <ChatMessageItem
              key={message.id}
              message={message}
              contact={contact}
              // onOpenLightbox={() => lightbox.onOpen(message.body)}
              onOpenLightbox={() => console.log('images')}
            />
          </>
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
