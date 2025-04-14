import type { Message } from 'src/types/chat';

import { create } from 'zustand';

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessages: (newMessages) => set((state) => ({ messages: [...state.messages, ...newMessages] })),
  clearMessages: () => set({ messages: [] }),
}));
