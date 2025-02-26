import type { IChatParticipant } from 'src/types/chat';

// import { useMemo, useState } from 'react';

import NoteIcon from '@mui/icons-material/Note';
import { Box, Stack, Button, IconButton } from '@mui/material';

// import { today } from 'src/utils/format-time';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

// import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  recipients: IChatParticipant[];
  selectedConversationId: string;
  onAddRecipients: (recipients: IChatParticipant[]) => void;
};

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
}: Props) {
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
    <Box>
      <Editor sx={{ maxHeight: 720 }} />
      <Stack direction="row" sx={{ justifyContent: 'space-between', p: 1 }}>
        <IconButton>
          <NoteIcon />
        </IconButton>
        <Button variant="contained" color="primary" endIcon={<Iconify icon="mdi:send" />}>
          Send
        </Button>
      </Stack>
    </Box>
  );
}
