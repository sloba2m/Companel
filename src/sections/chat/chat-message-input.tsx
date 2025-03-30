// import { useMemo, useState } from 'react';

import { Tab, Tabs, Card, Stack, Button, Divider, IconButton } from '@mui/material';

// import { today } from 'src/utils/format-time';

import { useState } from 'react';

import { useTabs } from 'src/routes/hooks/use-tabs';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSendMessage } from 'src/actions/chat';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

import { MessageType } from 'src/types/chat';

// import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  lastMessageId?: string;
  conversationId: string;
};

export function ChatMessageInput({ lastMessageId, conversationId }: Props) {
  const basicTabs = useTabs('Message');
  const isTablet = useResponsive('between', 'sm', 'md');

  const [messageInput, setMessageInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const { mutate: sendMessage } = useSendMessage();

  const isNote = basicTabs.value === 'Note';

  const handleSendmessage = () => {
    sendMessage(
      {
        conversationId,
        data: {
          attachments: [],
          content: isNote ? noteInput : messageInput,
          messageType: isNote ? MessageType.NOTE : MessageType.OUTGOING,
          replyToMessageId: lastMessageId,
        },
      },
      {
        onSuccess: () => {
          if (isNote) setNoteInput('');
          else setMessageInput('');
        },
      }
    );
  };

  // const router = useRouter();

  // const { user } = useMockedUser();

  // const fileRef = useRef<HTMLInputElement>(null);

  // const [message] = useState('');

  // const myContact = useMemo(
  //   () => ({
  //     id: `${user?.id}`,
  //     role: `${user?.role}`,
  //     email: `${user?.email}`,
  //     address: `${user?.address}`,
  //     name: `${user?.displayName}`,
  //     lastActivity: today(),
  //     avatarUrl: `${user?.photoURL}`,
  //     phoneNumber: `${user?.phoneNumber}`,
  //     status: 'online' as 'online' | 'offline' | 'alway' | 'busy',
  //   }),
  //   [user]
  // );

  // const messageData = useMemo(
  //   () => ({
  //     id: uuidv4(),
  //     attachments: [],
  //     body: message,
  //     contentType: 'text',
  //     createdAt: fSub({ minutes: 1 }),
  //     senderId: myContact.id,
  //   }),
  //   [message, myContact.id]
  // );

  // const conversationData = useMemo(
  //   () => ({
  //     id: uuidv4(),
  //     messages: [messageData],
  //     participants: [...recipients, myContact],
  //     type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
  //     unreadCount: 0,
  //   }),
  //   [messageData, myContact, recipients]
  // );

  // const handleAttach = useCallback(() => {
  //   if (fileRef.current) {
  //     fileRef.current.click();
  //   }
  // }, []);

  // const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  //   setMessage(event.target.value);
  // }, []);

  // const handleSendMessage = useCallback(
  //   async (event: React.KeyboardEvent<HTMLInputElement>) => {
  //     try {
  //       if (event.key === 'Enter') {
  //         if (message) {
  //           if (selectedConversationId) {
  //             await sendMessage(selectedConversationId, messageData);
  //           } else {
  //             const res = await createConversation(conversationData);

  //             router.push(`${paths.navigation.inbox}?id=${res.conversation.id}`);

  //             onAddRecipients([]);
  //           }
  //         }
  //         setMessage('');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [conversationData, message, messageData, onAddRecipients, router, selectedConversationId]
  // );

  return (
    <Card sx={{ flexShrink: 0, borderBottomLeftRadius: isTablet ? '8px' : 0 }}>
      <Tabs value={basicTabs.value} onChange={basicTabs.onChange} sx={{ mx: 2 }}>
        <Tab key="Message" value="Message" label="Message" />
        <Tab key="Note" value="Note" label="Note" />
      </Tabs>
      <Divider />
      {basicTabs.value === 'Message' && (
        <Editor
          sx={{ maxHeight: 720, borderTop: 'none' }}
          value={messageInput}
          onChange={(val) => setMessageInput(val)}
        />
      )}
      {basicTabs.value === 'Note' && (
        <Editor
          sx={{ maxHeight: 720, borderTop: 'none' }}
          value={noteInput}
          onChange={(val) => setNoteInput(val)}
        />
      )}
      <Stack direction="row" sx={{ justifyContent: 'space-between', p: 1 }}>
        <IconButton size="small">
          <Iconify icon="ic:baseline-attach-file" />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<Iconify icon="mdi:send" />}
          onClick={handleSendmessage}
        >
          Send
        </Button>
      </Stack>
    </Card>
  );
}
