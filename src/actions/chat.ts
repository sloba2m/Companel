import type { StatusFilters } from 'src/sections/chat/chat-nav';
import type {
  Message,
  IChatMessage,
  Conversation,
  IChatParticipant,
  IChatConversation,
} from 'src/types/chat';

import { mutate } from 'swr';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { keyBy } from 'src/utils/helper';
import axios, { fetcher, endpoints, mutationFetcher } from 'src/utils/axios';

import { CONTACTS_DATA, CONVERSATIONS_DATA } from './chat-mock';

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = endpoints.chat;

// const swrOptions = {
//   revalidateIfStale: enableServer,
//   revalidateOnFocus: enableServer,
//   revalidateOnReconnect: enableServer,
// };

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

export function useGetContactsOld() {
  // const url = [CHART_ENDPOINT, { params: { endpoint: 'contacts' } }];

  // const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, fetcher, swrOptions);

  const data = CONTACTS_DATA as ContactsData;

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts || [],
      // contactsLoading: isLoading,
      // contactsError: error,
      // contactsValidating: isValidating,
      // contactsEmpty: !isLoading && !data?.contacts.length,
    }),
    [data?.contacts]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationsData = {
  conversations: IChatConversation[];
};

export function useGetConversationsOld() {
  // const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  // const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(
  //   url,
  //   fetcher,
  //   swrOptions
  // );

  const data = CONVERSATIONS_DATA as ConversationsData;

  const memoizedValue = useMemo(() => {
    const byId = data?.conversations.length ? keyBy(data.conversations, 'id') : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: false,
      // conversationsError: error,
      // conversationsValidating: isValidating,
      // conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

// type ConversationData = {
//   conversation: IChatConversation;
// };

export function useGetConversation(conversationId: string) {
  // const url = conversationId
  //   ? [CHART_ENDPOINT, { params: { conversationId, endpoint: 'conversation' } }]
  //   : '';

  // const { data, isLoading, error, isValidating } = useSWR<ConversationData>(
  //   url,
  //   fetcher,
  //   swrOptions
  // );

  const conversation = CONVERSATIONS_DATA.conversations.find(
    (conv) => conv.id === conversationId
  ) as IChatConversation;

  const memoizedValue = useMemo(
    () => ({
      conversation,
      conversationLoading: false,
      conversationError: false,
      // conversationValidating: ,
    }),
    [conversation]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const conversationsUrl = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  const conversationUrl = [
    CHART_ENDPOINT,
    { params: { conversationId, endpoint: 'conversation' } },
  ];

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { conversationId, messageData };
    await axios.put(CHART_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    conversationUrl,
    (currentData) => {
      const currentConversation: IChatConversation = currentData.conversation;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return { ...currentData, conversation };
    },
    false
  );

  mutate(
    conversationsUrl,
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations: IChatConversation[] = currentConversations.map(
        (conversation: IChatConversation) =>
          conversation.id === conversationId
            ? { ...conversation, messages: [...conversation.messages, messageData] }
            : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(CHART_ENDPOINT, data);

  /**
   * Work in local
   */
  mutate(
    url,
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations: IChatConversation[] = [...currentConversations, conversationData];

      return { ...currentData, conversations };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  }

  /**
   * Work in local
   */
  mutate(
    [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }],
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations = currentConversations.map((conversation: IChatConversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

interface LinksInfo {
  self: string;
  next: string;
}

export interface ConversationData {
  items: Conversation[];
  links: LinksInfo;
}

interface UseGetConversationsParams {
  page?: number;
  size?: number;
  inboxId?: string;
  filter: StatusFilters;
  sort?: string;
  contactId?: string;
}

export const useGetConversations = (
  {
    page = 0,
    size = 10,
    inboxId,
    filter,
    contactId,
    sort = 'lastContactActivity,desc',
  }: UseGetConversationsParams,
  options?: { enabled?: boolean }
) => {
  const params: Record<string, any> = {
    page,
    size,
    inboxId,
    sort,
    contactId,
  };

  switch (filter) {
    case 'unhandled':
      params.assigned = false;
      break;
    case 'mine':
      params.myConversations = true;
      break;
    case 'closed':
      params.status = 'RESOLVED';
      break;
    case 'all':
      break;
    default:
      console.warn(`Unknown filter type: ${filter}`);
      break;
  }

  return useQuery<ConversationData>({
    queryKey: ['conversations', { page, size, inboxId, filter, sort, contactId }],
    queryFn: () =>
      fetcher([
        '/v2/conversation',
        {
          params,
        },
      ]),
    enabled: options?.enabled !== false,
  });
};

interface MessagesData {
  items: Message[];
  links: LinksInfo;
}

export const useGetMessages = (conversationId: string) =>
  useQuery<MessagesData>({
    queryKey: ['messages', { conversaationId: conversationId }],
    queryFn: () => fetcher(`/v2/conversation/${conversationId}/message`),
    enabled: conversationId !== '',
  });

interface TagToConversationInput {
  conversationId: string;
  tagId: string;
}

export const useAddTagToConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TagToConversationInput) =>
      mutationFetcher('post', `/conversation/${payload.conversationId}/tag/${payload.tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useRemoveTagFromConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TagToConversationInput) =>
      mutationFetcher('delete', `/conversation/${payload.conversationId}/tag/${payload.tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

interface AssignUserInput {
  conversationId: string;
  userId: string;
  action: 'assign' | 'unassign';
}

export const useAssignUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignUserInput) =>
      mutationFetcher('post', `/conversation/${payload.conversationId}:${payload.action}`, {
        userId: payload.userId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
