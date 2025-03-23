import type { Customer } from './customers';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  customer: Customer | null;
}

export type ContactPayload = Omit<Contact, 'id' | 'createdAt' | 'customer'>;
