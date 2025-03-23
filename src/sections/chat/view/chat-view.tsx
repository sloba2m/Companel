import type { IChatParticipant } from 'src/types/chat';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetContactsOld,
  useGetConversation,
  useGetConversations,
  useGetConversationsOld,
} from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';

import { Layout } from '../layout';
import { ChatRoom } from '../chat-room';
import { ChatNav, StatusFilters } from '../chat-nav';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const { contacts } = useGetContactsOld();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  const [selectedInboxes, setSelectedInboxes] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilters>(StatusFilters.ALL);

  const handleInboxChange = (value: string) => {
    setSelectedInboxes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const { conversations, conversationsLoading } = useGetConversationsOld();

  const { data: conversationsData } = useGetConversations(
    { inboxId: selectedInboxes[0] ? selectedInboxes[0] : '', filter: selectedFilter },
    { enabled: !!selectedInboxes.length }
  );

  const { conversation, conversationError, conversationLoading } = useGetConversation(
    `${selectedConversationId}`
  );

  const isTablet = useResponsive('between', 'sm', 'lg');

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants: IChatParticipant[] = conversation
    ? conversation.participants.filter(
        (participant: IChatParticipant) => participant.id !== `${user?.id}`
      )
    : [];

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.navigation.inbox);
    }
  }, [conversationError, router, selectedConversationId]);

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
              participants={participants}
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
              conversations={conversations}
              loading={conversationsLoading}
              selectedInboxes={selectedInboxes}
              handleInboxChange={handleInboxChange}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              conversationData={conversationsData}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList
                  messages={conversation?.messages ?? []}
                  participants={participants}
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
              participants={participants}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
