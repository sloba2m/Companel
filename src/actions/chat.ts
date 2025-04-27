import type { StatusFilters } from 'src/sections/chat/chat-nav';
import type {
  Event,
  Message,
  Attachment,
  SearchChat,
  MessageType,
  Conversation,
  SearchInboxes,
} from 'src/types/chat';

import { useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

import { useMessageStore } from 'src/stores/messageStore';
import { useConversationStore } from 'src/stores/conversationStore';

import { ChannelFilters } from 'src/types/chat';

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

const buildConversationParams = ({
  inboxIds,
  filter,
  contactId,
  channelType,
}: UseGetConversationsParams): Record<string, any> => {
  const params: Record<string, any> = { contactId };

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

  return params;
};

const useConversationsQuery = (
  params: Record<string, any>,
  queryKey: any,
  enabled: boolean = true
) =>
  useInfiniteQuery<ConversationData>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const url =
        typeof pageParam === 'string' && pageParam !== '' ? pageParam : '/v2/conversation';

      return fetcher([url, { params }]);
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.links?.next ?? undefined,
    enabled,
  });

export const useGetConversations = (
  args: UseGetConversationsParams,
  options?: { enabled?: boolean }
) => {
  const { setConversations } = useConversationStore();
  const params = buildConversationParams(args);
  const res = useConversationsQuery(params, ['conversations', args], options?.enabled);

  const conversations = useMemo(
    () => res.data?.pages.flatMap((page) => page.items) ?? [],
    [res.data]
  );

  useEffect(() => {
    setConversations(conversations);
  }, [conversations, setConversations]);

  return res;
};

export const useGetConversationsNoStore = (
  args: UseGetConversationsParams,
  options?: { enabled?: boolean }
) => {
  const params = buildConversationParams(args);
  return useConversationsQuery(params, ['conversations', args], options?.enabled);
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

export const useAddTagToConversation = () =>
  useMutation({
    mutationFn: (payload: TagToConversationInput) =>
      mutationFetcher('post', `/conversation/${payload.conversationId}/tag/${payload.tagId}`),
  });

export const useRemoveTagFromConversation = () =>
  useMutation({
    mutationFn: (payload: TagToConversationInput) =>
      mutationFetcher('delete', `/conversation/${payload.conversationId}/tag/${payload.tagId}`),
  });

interface AssignUserInput {
  conversationId: string;
  userId: string;
  action: 'assign' | 'unassign';
}

export const useAssignUser = () =>
  useMutation({
    mutationFn: (payload: AssignUserInput) =>
      mutationFetcher('post', `/conversation/${payload.conversationId}:${payload.action}`, {
        userId: payload.userId,
      }),
  });

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

export const useReadMessage = () =>
  useMutation({
    mutationFn: (payload: ReadMessageInput) =>
      mutationFetcher(
        'post',
        `/conversation/${payload.conversationId}/message/${payload.messageId}:read`
      ),
  });

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

export const useSearchInboxes = (query: string) =>
  useQuery<SearchInboxes>({
    queryKey: ['inbox-search', { query }],
    queryFn: () => fetcher([`/search/conversation`, { params: { query } }]),
    enabled: query !== '',
  });
