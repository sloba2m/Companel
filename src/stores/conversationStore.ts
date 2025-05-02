import type { Tag } from 'src/types/tags';
import type { Conversation } from 'src/types/chat';

import { create } from 'zustand';

interface ConversationStore {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversation: Conversation) => void;
  clearConversations: () => void;
  addTagToConversation: (conversationId: string, tag: Tag) => void;
  removeTagFromConversation: (conversationId: string, tagId: string) => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),

  addConversation: (newConversation) =>
    set((state) => ({ conversations: [...state.conversations, newConversation] })),

  updateConversation: (updatedConversation) => {
    const currentConversationId = getCurrentConversationId();

    set((state) => ({
      conversations: state.conversations.map((conversation) => {
        if (conversation.id !== updatedConversation.id) return conversation;
        conversation.assignee = updatedConversation.assignee;
        conversation.tags = updatedConversation.tags;
        conversation.lastContactActivity = updatedConversation.lastContactActivity;
        conversation.status = updatedConversation.status;
        if (
          conversation.unreadMessages === 0 ||
          !isOnConversation(currentConversationId, updatedConversation)
        ) {
          conversation.unreadMessages = updatedConversation.unreadMessages;
        }
        return conversation;
      }),
    }));
  },

  clearConversations: () => set({ conversations: [] }),

  addTagToConversation: (conversationId, tag) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        const alreadyExists = conversation.tags.some((t) => t.id === tag.id);
        if (alreadyExists) return conversation;

        return {
          ...conversation,
          tags: [...conversation.tags, tag],
        };
      }),
    })),

  removeTagFromConversation: (conversationId, tagId) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        return {
          ...conversation,
          tags: conversation.tags.filter((t) => t.id !== tagId),
        };
      }),
    })),
}));

const getCurrentConversationId = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('conversationId');
};

const isOnConversation = (
  selectedConversationId: string | null,
  conversation: Conversation
): boolean => conversation.id === selectedConversationId;
