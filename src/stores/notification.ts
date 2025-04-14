import type { Notification } from 'src/types/notifications';

import { create } from 'zustand';

import { mutationFetcher } from 'src/utils/axios';

interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: async (newNotification) => {
    const currentConversationId = getCurrentConversationId();
    if (!shouldReceive(newNotification, currentConversationId)) {
      await readNotification(newNotification.id);
      return;
    }

    set((state) => ({ notifications: [...state.notifications, newNotification] }));
  },
  clearNotifications: () => set({ notifications: [] }),
}));

const getCurrentConversationId = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('conversationId');
};

const shouldReceive = (
  notification: Notification,
  currentConversationId: string | null
): boolean => {
  if (notification.type === 'MESSAGE_IN_ASSIGNED_CONVERSATION') {
    const conversation = notification.references.find((r) => r.keyword === 'conversation');
    if (conversation) {
      return currentConversationId !== conversation.referenceId;
    }
  }
  return true;
};

export const readNotification = (id: string): Promise<void> =>
  mutationFetcher('post', `/notification/${id}:read`);
