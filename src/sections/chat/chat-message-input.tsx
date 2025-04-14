// import { useMemo, useState } from 'react';

import {
  Tab,
  Box,
  Tabs,
  Card,
  Stack,
  Button,
  Divider,
  useTheme,
  IconButton,
  Typography,
} from '@mui/material';

// import { today } from 'src/utils/format-time';

import type { Message, Attachment } from 'src/types/chat';

import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useTabs } from 'src/routes/hooks/use-tabs';

import { useResponsive } from 'src/hooks/use-responsive';

import { varAlpha } from 'src/theme/styles';
import {
  useSendMessage,
  useGenerateTemplate,
  useUploadAttachment,
  useCreateConversation,
} from 'src/actions/chat';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

import { MessageType } from 'src/types/chat';

import type { ComposeFormState } from './view';

// import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  lastMessageId?: string;
  conversationId: string;
  composeFormState: ComposeFormState;
  resetComposeState: () => void;
};

export function ChatMessageInput({
  lastMessageId,
  conversationId,
  composeFormState,
  resetComposeState,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const basicTabs = useTabs('Message');
  const isTablet = useResponsive('between', 'sm', 'md');
  const theme = useTheme();

  const [messageInput, setMessageInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { mutate: sendMessage } = useSendMessage();
  const { mutate: generateTemplate } = useGenerateTemplate();
  const { mutate: createConversation } = useCreateConversation();
  const { mutate: uploadMutation } = useUploadAttachment();

  const [templateSet, setTemplateSet] = useState(0);

  const isNote = basicTabs.value === 'Note';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadMutation(
        { conversationId, file },
        { onSuccess: (data) => setAttachments((prev) => [...prev, data]) }
      );
    }

    event.target.value = '';
  };

  const handleSendmessage = () => {
    const inboxId = composeFormState.inbox?.id;
    const parsedAttachments = attachments.map((att) => att.id);

    if (!conversationId && inboxId) {
      createConversation(
        {
          attachments: parsedAttachments,
          content: messageInput,
          email: composeFormState.to,
          inboxId,
          name: composeFormState.name,
          subject: composeFormState.subject,
        },
        {
          onSuccess: (data: Message) => {
            router.push(
              `${paths.navigation.inboxBase}?status=all&id=${inboxId}&conversationId=${data.conversationId}`
            );
            resetComposeState();
          },
        }
      );
    }
    sendMessage(
      {
        conversationId,
        data: {
          attachments: parsedAttachments,
          content: isNote ? noteInput : messageInput,
          messageType: isNote ? MessageType.NOTE : MessageType.OUTGOING,
          replyToMessageId: lastMessageId,
        },
      },
      {
        onSuccess: () => {
          if (isNote) {
            setNoteInput('');
          } else setMessageInput('');
        },
      }
    );
  };

  useEffect(() => {
    if (conversationId === '') return;
    generateTemplate(conversationId, {
      onSuccess: (data: { content: string }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, 'text/html');

        const images = doc.querySelectorAll('img');
        images.forEach((img) => {
          const parent = img.parentElement;
          if (parent?.tagName === 'P' && parent.childNodes.length === 1) {
            parent.replaceWith(img);
          }
        });

        const cleanedHtml = doc.body.innerHTML;
        setMessageInput(cleanedHtml);
        setTemplateSet((prev) => prev + 1);
      },
    });
  }, [conversationId, generateTemplate]);

  return (
    <Card sx={{ flexShrink: 0, borderBottomLeftRadius: isTablet ? '8px' : 0 }}>
      <Tabs value={basicTabs.value} onChange={basicTabs.onChange} sx={{ mx: 2 }}>
        <Tab key="Message" value="Message" label={t('conversations.messageType.reply')} />
        <Tab key="Note" value="Note" label={t('conversations.messageType.note')} />
      </Tabs>
      <Divider />
      {basicTabs.value === 'Message' && (
        <Editor
          key="message"
          sx={{ maxHeight: 720, borderTop: 'none' }}
          value={messageInput}
          resetValue={messageInput === ''}
          onChange={(val) => setMessageInput(val)}
          conversationId={conversationId}
          placeholder={t('conversations.new.writeAMessage')}
          templateSet={templateSet}
          isResizible
        />
      )}
      {basicTabs.value === 'Note' && (
        <Editor
          key="note"
          sx={{
            maxHeight: 720,
            borderTop: 'none',
            outline: `1px solid ${varAlpha(theme.palette.warning.lightChannel, 0.7)}`,
            backgroundColor: varAlpha(theme.palette.warning.lightChannel, 0.1),
            outlineOffset: -1,
          }}
          value={noteInput}
          resetValue={noteInput === ''}
          onChange={(val) => setNoteInput(val)}
          conversationId={conversationId}
          placeholder={t('conversations.new.writeANote')}
          templateSet={templateSet}
          isResizible
        />
      )}
      <Stack direction="row" sx={{ justifyContent: 'space-between', p: 1 }}>
        <Box sx={{ display: 'flex', ml: 1, gap: 1 }}>
          <IconButton size="small" onClick={onAttachClick}>
            <Iconify icon="ic:baseline-attach-file" />
          </IconButton>
          <input
            type="file"
            accept="*/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {attachments.map((att) => (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                px: 1,
                backgroundColor: theme.vars.palette.background.default,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{att.fileName}</Typography>
            </Box>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<Iconify icon="mdi:send" />}
          onClick={handleSendmessage}
        >
          {t('conversations.messageSendButton')}
        </Button>
      </Stack>
    </Card>
  );
}
