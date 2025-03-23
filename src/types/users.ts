export interface User {
  id: string;
  authId: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
}

export type UserPayload = Omit<User, 'id' | 'authId' | 'fullName'>;

enum RoleEnum {
  OfflineAccess = 'offline_access',
  Agent = 'agent',
  Default = 'default-roles-communication-platform',
  Administrator = 'Administrator',
  UMA = 'uma_authorization',
}

export interface Role {
  id: string;
  name: RoleEnum;
}
