import type { User } from './users';

export interface Notification {
  id: string;
  recipient: User;
  type: 'CONVERSATION_ASSIGNED' | 'MESSAGE_IN_ASSIGNED_CONVERSATION' | 'CONVERSATION_UN_ASSIGNED';
  isRead: boolean;
  references: Reference[];
  createdAt: string;
}

export interface Reference {
  keyword: 'actor' | 'assignee' | 'conversation';
  referenceName: string;
  referenceId: string;
  referenceType: 'USER' | 'CONVERSATION';
  createdAt: string;
}
