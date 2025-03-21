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

export interface Customer {
  id: string;
  name: string;
  email: string;
  domain: string;
  phoneNumber: string | null;
  customCustomerId: string | null;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  customer: Customer;
}

export interface Tag {
  createdAt: string;
  name: string;
  id: string;
}

export interface Assignee {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
}

export interface Conversation {
  id: string;
  inboxId: string;
  status: string;
  subject: string;
  contact: Contact;
  assignee: Assignee | null;
  tags: Tag[];
  createdAt: string;
  lastContactActivity: string;
  unreadMessages: number;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
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
