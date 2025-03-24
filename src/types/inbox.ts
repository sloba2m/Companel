export interface EmailTemplate {
  id: string;
  name: string;
  template: string;
  logoUrl: string;
}

export type EmailProvider = 'MICROSOFT_OAUTH';

export interface EmailChannel {
  email: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  provider: EmailProvider;
  imapAddress: string;
  imapEnabled: boolean;
  imapPort: number;
  imapLogin: string;
  imapPassword: string;
  imapEnableSsl: boolean;
  smtpEnabled: boolean;
  smtpAddress: string;
  smtpPort: number;
  smtpLogin: string;
  smtpPassword: string;
  smtpDomain: string;
  smtpEnableStarttlsAuto: boolean;
  smtpAuthentication: string;
  smtpOpensslVerifyMode: string;
  smtpEnableSslTls: boolean;
  providerConfig: unknown;
}

export interface Inbox {
  externalId: string;
  name: string;
  emailChannel: EmailChannel;
  emailAddress: string | null;
  createdAt: string;
  updatedAt: string;
  emailTemplate: EmailTemplate;
}
