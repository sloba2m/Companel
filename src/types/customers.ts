export interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  domain: string | null;
  phoneNumber: string | null;
  customCustomerId: string | null;
  createdAt: string;
}

export type CustomerPayload = Omit<Customer, 'id' | 'createdAt'>;
