import type { ChannelFilters } from 'src/types/chat';
import type { WorkspaceInbox } from 'src/actions/account';
import type { LocalStorageFilters } from 'src/pages/inbox';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { setStorage } from 'src/hooks/use-local-storage';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useMessageStore } from 'src/stores/messageStore';
import { useConversationStore } from 'src/stores/conversationStore';
import {
  useSearchChat,
  useGetMessages,
  useReadMessage,
  useGetEventHistory,
  useGetConversations,
} from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { Layout } from '../layout';
import { ChatNav } from '../chat-nav';
import { ChatRoom } from '../chat-room';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../hooks/use-collapse-nav';

import type { StatusFilters } from '../chat-nav';

// ----------------------------------------------------------------------

export type ComposeFormState = {
  inbox?: WorkspaceInbox;
  to: string;
  cc: string;
  name: string;
  subject: string;
};

export function ChatView() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [chatSearch, setChatSearch] = useState('');

  const selectedConversationId = searchParams.get('conversationId') || '';
  const selectedInboxes = searchParams.getAll('id');
  const selectedStatus = searchParams.get('status') as StatusFilters;
  const selectedChannel = searchParams.get('channel') as ChannelFilters;

  const filters: LocalStorageFilters = {
    channel: selectedChannel,
    id: selectedInboxes,
    status: selectedStatus,
    conversationId: selectedConversationId,
  };

  setStorage('inboxQuery', filters);

  const { isLoading: conversationsLoading, fetchNextPage: fetchNextConversationsPage } =
    useGetConversations(
      { inboxIds: selectedInboxes, filter: selectedStatus, channelType: selectedChannel },
      { enabled: !!selectedInboxes.length }
    );

  const { conversations } = useConversationStore();

  const conversation = conversations.find((item) => item.id === selectedConversationId);

  const { isLoading: messagesLoading, fetchNextPage } = useGetMessages(selectedConversationId);
  const { messages } = useMessageStore();

  const { data: eventHistoryData } = useGetEventHistory(selectedConversationId);

  const { mutate: readMessageMutation } = useReadMessage();
  const { data: chatSearchData } = useSearchChat({
    conversationId: selectedConversationId,
    query: chatSearch,
  });

  const isTablet = useResponsive('between', 'sm', 'lg');

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const [composeFormState, setComposeFormState] = useState<ComposeFormState>({
    inbox: undefined,
    to: '',
    cc: '',
    name: '',
    subject: '',
  });

  const handleComposeChange = (field: keyof ComposeFormState, value: any) => {
    setComposeFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetComposeState = () => {
    setComposeFormState({
      inbox: undefined,
      to: '',
      cc: '',
      name: '',
      subject: '',
    });
  };

  useEffect(() => {
    if (conversation && messages.length && conversation.unreadMessages > 0) {
      readMessageMutation({
        conversationId: conversation.id,
        messageId: messages[messages.length - 1].id,
      });
    }
  }, [conversation, readMessageMutation, messages]);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        p: 0,
        mb: isTablet ? 3 : 0,
      }}
    >
      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          header: selectedConversationId ? (
            <ChatHeaderDetail
              key={selectedConversationId}
              collapseNav={roomNav}
              collapseMenuNav={conversationsNav}
              conversation={conversation}
              loading={messagesLoading}
              onChatSearch={(val) => setChatSearch(val)}
              chatSearchData={chatSearchData}
            />
          ) : (
            <ChatHeaderCompose
              onOpenMobile={conversationsNav.onOpenMobile}
              onChange={handleComposeChange}
              values={composeFormState}
            />
          ),
          nav: (
            <ChatNav
              loading={conversationsLoading}
              selectedInboxes={selectedInboxes}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              conversations={conversations}
              selectedFilter={selectedStatus}
              selectedChannel={selectedChannel}
              fetchNextPage={fetchNextConversationsPage}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList
                  key={`${selectedConversationId}MessageList`}
                  fetchNextPage={fetchNextPage}
                  messages={messages}
                  events={eventHistoryData ?? []}
                  contact={conversation?.contact}
                  loading={messagesLoading}
                  conversationName={conversation?.subject ?? '-'}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-chat-active.svg`}
                  title={t('conversations.new.hello')}
                  description={t('conversations.new.writeAMessage')}
                />
              )}

              <ChatMessageInput
                key={selectedConversationId}
                resetComposeState={resetComposeState}
                composeFormState={composeFormState}
                conversationId={selectedConversationId}
                lastMessageId={messages.length ? messages[messages.length - 1].id : undefined}
              />
            </>
          ),
          details: selectedConversationId && (
            <ChatRoom collapseNav={roomNav} conversation={conversation} loading={messagesLoading} />
          ),
        }}
      />
    </DashboardContent>
  );
}
