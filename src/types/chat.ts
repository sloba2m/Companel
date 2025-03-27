import type { Tag } from './tags';
import type { User } from './users';
import type { Contact } from './contacts';
import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IChatMessage = {
  id: string;
  body: string;
  senderId: string;
  contentType: string;
  createdAt: IDateValue;
  attachments: IChatAttachment[];
  note?: string;
};

export type IChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: IDateValue;
  status: 'online' | 'offline' | 'alway' | 'busy';
};

export type IChatConversation = {
  id: string;
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
  participants: IChatParticipant[];
};

export type IChatConversations = {
  byId: Record<string, IChatConversation>;
  allIds: string[];
};

export interface Conversation {
  id: string;
  inboxId: string;
  status: string;
  subject: string;
  contact: Contact;
  assignee: User | null;
  tags: Tag[];
  createdAt: string;
  lastContactActivity: string;
  unreadMessages: number;
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  REOPENED = 'REOPENED',
  PENDING = 'PENDING',
  SNOOZED = 'SNOOZED',
}

export enum AssignedStatus {
  RESOLVED = 'RESOLVED',
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
}

export interface Message {
  id: string;
  conversationId: string;
  contact: Contact;
  content: string;
  type: 'INCOMING' | 'OUTGOING';
  remoteReceivedAt: string;
  createdAt: string;
  updatedAt: string;
  messagePrivate: boolean;
  status: 'DELIVERED' | 'READ' | 'FAILED' | string;
  createdBy: string;
  read: boolean | null;
  user: User | null;
  attachments: any[]; // replace any
}
