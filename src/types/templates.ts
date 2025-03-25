export interface Template {
  id: string;
  name: string;
  template: string;
  logoUrl: string;
}

export type TemplatePayload = {
  name: string;
  template: string;
  logoFile?: File | null;
  logoUrl?: string;
};
