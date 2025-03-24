export interface EmailTemplate {
  id: string;
  name: string;
  template: string;
  logoUrl: string;
}

export type EmailProvider = 'MICROSOFT_OAUTH' | 'MICROSOFT_BASIC';

export interface EmailChannel {
  email?: string | null;
  clientId?: string | null;
  clientSecret?: string | null;
  tenantId?: string | null;
  provider?: EmailProvider | null;
  imapAddress?: string | null;
  imapEnabled?: boolean | null;
  imapPort?: number | null;
  imapLogin?: string | null;
  imapPassword?: string | null;
  imapEnableSsl?: boolean | null;
  smtpEnabled?: boolean | null;
  smtpAddress?: string | null;
  smtpPort?: number | null;
  smtpLogin?: string | null;
  smtpPassword?: string | null;
  smtpDomain?: string | null;
  smtpEnableStarttlsAuto?: boolean | null;
  smtpAuthentication?: string | null;
  smtpOpensslVerifyMode?: string | null;
  smtpEnableSslTls?: boolean | null;
  providerConfig?: string | null;
}

export interface InboxPayload extends EmailChannel {
  name?: string | null;
  emailTemplateId?: string | null;
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
