import type { Tag } from './tags';
import type { User } from './users';
import type { Contact } from './contacts';

// ----------------------------------------------------------------------

export interface Conversation {
  id: string;
  inboxId: string;
  channelType: 'EMAIL' | 'WIDGET';
  status: ConversationStatus;
  subject: string;
  contact: Contact | null;
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

export enum MessageType {
  OUTGOING = 'OUTGOING',
  NOTE = 'NOTE',
  INCOMING = 'INCOMING',
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
  attachments: any[];
}

export enum RevisionType {
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
  REASSIGNED = 'REASSIGNED',
  STATUS_UPDATE = 'STATUS_UPDATE',
}

export interface Event {
  status: string;
  assigneeId: string;
  assigneeEmail: string;
  assigneeFullName: string;
  performedById: string;
  performedByEmail: string;
  performedByFullName: string;
  revisionType: RevisionType;
  revisionTimestamp: string;
}

export interface Attachment {
  fileName: string;
  id: string;
  fileType: string | null;
  contentType: string;
  url: string;
  contentLength: number | null;
  coordinatesLat: number;
  coordinatesLong: number;
}

interface SearchHighlight {
  field: string;
  fragments: string[];
}

export interface SearchChat {
  message: Message;
  highlights: SearchHighlight[];
}
