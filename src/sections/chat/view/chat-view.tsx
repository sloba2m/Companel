import type { IChatParticipant } from 'src/types/chat';

import { useState, useCallback } from 'react';

import { useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetMessages,
  useGetContactsOld,
  useGetConversation,
  useGetConversations,
  useGetConversationsOld,
} from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';

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

export function ChatView() {
  const { user } = useMockedUser();

  const { contacts } = useGetContactsOld();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('conversationId') || '';
  const selectedInboxes = searchParams.getAll('id');
  const selectedStatus = searchParams.get('status') as StatusFilters;

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  const { conversationsLoading } = useGetConversationsOld();

  const { data: conversationsData } = useGetConversations(
    { inboxId: selectedInboxes[0] ? selectedInboxes[0] : '', filter: selectedStatus },
    { enabled: !!selectedInboxes.length }
  );

  const { conversation, conversationLoading } = useGetConversation(`${selectedConversationId}`);

  const contact = conversationsData?.items.find(
    (item) => item.id === selectedConversationId
  )?.contact;

  const { data: messages } = useGetMessages(selectedConversationId);

  const isTablet = useResponsive('between', 'sm', 'lg');

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
    setRecipients(selected);
  }, []);

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
              contact={contact}
              loading={conversationLoading}
            />
          ) : (
            <ChatHeaderCompose
              contacts={contacts}
              onAddRecipients={handleAddRecipients}
              onOpenMobile={conversationsNav.onOpenMobile}
            />
          ),
          nav: (
            <ChatNav
              loading={conversationsLoading}
              selectedInboxes={selectedInboxes}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              conversationData={conversationsData}
              selectedFilter={selectedStatus}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList
                  messages={messages?.items?.slice().reverse() ?? []}
                  contact={contact}
                  loading={conversationLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-chat-active.svg`}
                  title="Good morning!"
                  description="Write a message..."
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
              />
            </>
          ),
          details: selectedConversationId && (
            <ChatRoom
              collapseNav={roomNav}
              contact={contact}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
