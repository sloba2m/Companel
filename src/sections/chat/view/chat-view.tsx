import type { WorkspaceInbox } from 'src/actions/account';

import { useMemo, useState, useEffect } from 'react';

import { useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMessages, useReadMessage, useGetConversations } from 'src/actions/chat';

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
  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('conversationId') || '';
  const selectedInboxes = searchParams.getAll('id');
  const selectedStatus = searchParams.get('status') as StatusFilters;

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    fetchNextPage: fetchNextConversationsPage,
  } = useGetConversations(
    { inboxIds: selectedInboxes, filter: selectedStatus },
    { enabled: !!selectedInboxes.length }
  );

  const conversations = useMemo(
    () => conversationsData?.pages.flatMap((page) => page.items) ?? [],
    [conversationsData]
  );

  const conversation = conversations.find((item) => item.id === selectedConversationId);

  const {
    data: messages,
    isLoading: messagesLoading,
    fetchNextPage,
  } = useGetMessages(selectedConversationId);

  const { mutate: readMessageMutation } = useReadMessage();

  const isTablet = useResponsive('between', 'sm', 'lg');

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const reversedMessages = useMemo(
    () =>
      messages?.pages
        .flatMap((page) => page.items)
        .slice()
        .reverse() ?? [],
    [messages]
  );

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
    if (conversation && reversedMessages.length && conversation.unreadMessages > 0) {
      readMessageMutation({
        conversationId: conversation.id,
        messageId: reversedMessages[reversedMessages.length - 1].id,
      });
    }
  }, [conversation, readMessageMutation, reversedMessages]);

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
              collapseNav={roomNav}
              collapseMenuNav={conversationsNav}
              conversation={conversation}
              loading={messagesLoading}
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
              fetchNextPage={fetchNextConversationsPage}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList
                  fetchNextPage={fetchNextPage}
                  messages={reversedMessages}
                  contact={conversation?.contact}
                  loading={messagesLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-chat-active.svg`}
                  title="Good morning!"
                  description="Write a message..."
                />
              )}

              <ChatMessageInput
                key={selectedConversationId}
                resetComposeState={resetComposeState}
                composeFormState={composeFormState}
                conversationId={selectedConversationId}
                lastMessageId={
                  reversedMessages.length
                    ? reversedMessages[reversedMessages.length - 1].id
                    : undefined
                }
              />
            </>
          ),
          details: selectedConversationId && (
            <ChatRoom
              collapseNav={roomNav}
              conversation={conversation}
              loading={messagesLoading}
              messages={[]}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
