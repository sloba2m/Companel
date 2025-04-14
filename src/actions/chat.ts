import type { StatusFilters } from 'src/sections/chat/chat-nav';
import type {
  Event,
  Message,
  Attachment,
  SearchChat,
  MessageType,
  Conversation,
} from 'src/types/chat';

import { useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

import { useMessageStore } from 'src/stores/messageStore';
import { useConversationStore } from 'src/stores/conversationStore';

import { ChannelFilters } from 'src/sections/chat/chat-nav';

interface LinksInfo {
  self: string;
  next: string;
}

export interface ConversationData {
  items: Conversation[];
  links: LinksInfo;
}

interface UseGetConversationsParams {
  inboxIds?: string[];
  filter: StatusFilters;
  channelType: ChannelFilters;
  contactId?: string;
}

export const useGetConversations = (
  { inboxIds, filter, contactId, channelType }: UseGetConversationsParams,
  options?: { enabled?: boolean }
) => {
  const { setConversations } = useConversationStore();
  const params: Record<string, any> = {
    contactId,
  };

  if (inboxIds?.length) {
    params.inboxIds = inboxIds;
  }

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

  if (channelType !== ChannelFilters.ALL) {
    params.channelType = channelType;
  }

  const res = useInfiniteQuery<ConversationData>({
    queryKey: ['conversations', { inboxIds, filter, contactId, channelType }],
    queryFn: async ({ pageParam }) => {
      const url =
        typeof pageParam === 'string' && pageParam !== '' ? pageParam : '/v2/conversation';

      return fetcher([url, { params }]);
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.links?.next ?? undefined,
    enabled: options?.enabled !== false,
  });

  const conversations = useMemo(
    () => res.data?.pages.flatMap((page) => page.items) ?? [],
    [res.data]
  );

  useEffect(() => {
    setConversations(conversations);
  }, [conversations, setConversations]);

  return res;
};

interface MessagesData {
  items: Message[];
  links: LinksInfo;
}

export const useGetMessages = (conversationId: string) => {
  const { setMessages } = useMessageStore();

  const res = useInfiniteQuery<MessagesData>({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam }) => {
      const url =
        typeof pageParam === 'string' && pageParam !== ''
          ? pageParam
          : `/v2/conversation/${conversationId}/message`;
      return fetcher(url);
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.links?.next ?? undefined,
    enabled: conversationId !== '',
  });

  const reversedMessages = useMemo(
    () =>
      res.data?.pages
        .flatMap((page) => page.items)
        .slice()
        .reverse() ?? [],
    [res.data]
  );

  useEffect(() => {
    setMessages(reversedMessages);
  }, [reversedMessages, setMessages]);

  return res;
};

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
      queryClient.invalidateQueries({ queryKey: ['revision'] });
    },
  });
};

interface SendMessageInput {
  conversationId: string;
  data: {
    attachments: string[];
    content: string;
    messageType: MessageType;
    replyToMessageId?: string;
  };
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessageInput) =>
      mutationFetcher('post', `/conversation/${payload.conversationId}/message`, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useGenerateTemplate = () =>
  useMutation({
    mutationFn: (conversationId: string) =>
      mutationFetcher('post', `/conversation/${conversationId}:generate-template-response`, {}),
  });

interface CreateConversationInput {
  attachments: any[];
  content: string;
  email: string;
  inboxId: string;
  name: string;
  subject: string;
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationInput) =>
      mutationFetcher('post', `/conversation`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

interface ReadMessageInput {
  conversationId: string;
  messageId: string;
}

export const useReadMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReadMessageInput) =>
      mutationFetcher(
        'post',
        `/conversation/${payload.conversationId}/message/${payload.messageId}:read`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useResolveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      mutationFetcher('post', `/conversation/${conversationId}:resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['revision'] });
    },
  });
};

export const useGetEventHistory = (coversationId: string) =>
  useQuery<Event[]>({
    queryKey: ['revision', { coversationId }],
    queryFn: () => fetcher(`/conversation/${coversationId}/revision`),
    enabled: coversationId !== '',
  });

interface AttachmentPayload {
  conversationId: string;
  file: File;
}

export const useUploadAttachment = () =>
  useMutation({
    mutationFn: (payload: AttachmentPayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);

      return mutationFetcher<Attachment>(
        'post',
        `/conversation/${payload.conversationId}/attachment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json, text/plain, */*',
          },
        }
      );
    },
  });

interface UseSearchChatInput {
  conversationId: string;
  query: string;
}

export const useSearchChat = ({ conversationId, query }: UseSearchChatInput) =>
  useQuery<SearchChat[]>({
    queryKey: ['chat-search', { conversationId, query }],
    queryFn: () => fetcher([`/search/conversation/${conversationId}`, { params: { query } }]),
    enabled: conversationId !== '' && query !== '',
  });
