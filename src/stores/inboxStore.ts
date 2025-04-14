import type { WorkspaceInbox } from 'src/actions/account';

import { create } from 'zustand';

interface InboxStore {
  inboxes: WorkspaceInbox[];
  setInboxes: (inboxes: WorkspaceInbox[]) => void;
  addInboxes: (inboxes: WorkspaceInbox[]) => void;
  clearInboxes: () => void;
}

export const useInboxStore = create<InboxStore>((set) => ({
  inboxes: [],
  setInboxes: (inboxes) => set({ inboxes }),
  addInboxes: (newInboxes) => set((state) => ({ inboxes: [...state.inboxes, ...newInboxes] })),
  clearInboxes: () => set({ inboxes: [] }),
}));
