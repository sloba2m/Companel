import type { Conversation } from 'src/types/chat';

import { create } from 'zustand';

interface ConversationStore {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversation: Conversation) => void;
  clearConversations: () => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
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
}));

const getCurrentConversationId = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('conversationId');
};

const isOnConversation = (
  selectedConversationId: string | null,
  conversation: Conversation
): boolean => conversation.id === selectedConversationId;
