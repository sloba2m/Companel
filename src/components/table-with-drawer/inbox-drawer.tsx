import type { ReactNode } from 'react';
import type { Inbox, InboxPayload, EmailProvider } from 'src/types/inbox';

import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { useGetTemplates } from 'src/actions/templates';

interface InboxDrawerProps {
  editData: Inbox | null;
  onSave: (data: InboxPayload, id?: string) => void;
}

const typeOptions: EmailProvider[] = ['MICROSOFT_OAUTH', 'MICROSOFT_BASIC'];

export const InboxDrawer = ({ editData, onSave }: InboxDrawerProps) => {
  const [formData, setFormData] = useState<InboxPayload>({
    name: '',
    email: '',
    provider: 'MICROSOFT_OAUTH',
    emailTemplateId: null,
    clientId: '',
    clientSecret: '',
    tenantId: '',
    imapAddress: '',
    imapEnabled: null,
    imapPort: null,
    imapLogin: '',
    imapPassword: '',
    imapEnableSsl: null,
    smtpEnabled: null,
    smtpAddress: '',
    smtpPort: null,
    smtpLogin: '',
    smtpPassword: '',
    smtpDomain: '',
    smtpEnableStarttlsAuto: null,
    smtpAuthentication: '',
    smtpOpensslVerifyMode: '',
    smtpEnableSslTls: null,
    providerConfig: '',
  });

  const { data: templatesData } = useGetTemplates();

  useEffect(() => {
    if (editData) {
      setFormData((prev) => ({
        ...prev,
        name: editData.name,
        email: editData.emailAddress,
        emailTemplateId: editData.emailTemplate.id ?? null,
        ...editData.emailChannel,
      }));
    }
  }, [editData]);

  const handleChange = (field: keyof InboxPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange =
    (field: keyof InboxPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} inbox</Typography>

      <TwoColumnBox>
        <Autocomplete
          fullWidth
          options={typeOptions}
          disabled={!!editData}
          value={formData.provider ?? 'MICROSOFT_OAUTH'}
          disableClearable
          onChange={(_e, val) => setFormData((prev) => ({ ...prev, provider: val }))}
          renderInput={(params) => (
            <TextField {...params} label="Type" margin="none" size="small" />
          )}
        />
        <Autocomplete
          fullWidth
          options={templatesData ?? []}
          getOptionLabel={(option) => option.name}
          value={templatesData?.find((t) => t.id === formData.emailTemplateId) ?? null}
          onChange={(_e, val) =>
            setFormData((prev) => ({ ...prev, emailTemplateId: val?.id ?? null }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Template" margin="none" size="small" />
          )}
        />
      </TwoColumnBox>

      <TwoColumnBox>
        <TextField
          label="Name"
          size="small"
          value={formData.name ?? ''}
          onChange={handleChange('name')}
        />
        <TextField
          label="Email"
          size="small"
          value={formData.email ?? ''}
          onChange={handleChange('email')}
        />
      </TwoColumnBox>

      {formData.provider === 'MICROSOFT_OAUTH' ? (
        <>
          <TextField
            label="Tenant ID"
            size="small"
            value={formData.tenantId ?? ''}
            onChange={handleChange('tenantId')}
          />
          <TextField
            label="Client ID"
            size="small"
            value={formData.clientId ?? ''}
            onChange={handleChange('clientId')}
          />
          <TextField
            label="Client secret"
            size="small"
            value={formData.clientSecret ?? ''}
            onChange={handleChange('clientSecret')}
          />
        </>
      ) : (
        <>
          <TwoColumnBox>
            <TextField
              label="Imap Address"
              size="small"
              value={formData.imapAddress ?? ''}
              onChange={handleChange('imapAddress')}
            />
            <TextField
              label="Imap Port"
              type="number"
              size="small"
              value={formData.imapPort ?? ''}
              onChange={handleChange('imapPort')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label="Imap Login"
              size="small"
              value={formData.imapLogin ?? ''}
              onChange={handleChange('imapLogin')}
            />
            <TextField
              label="Imap Password"
              type="password"
              size="small"
              value={formData.imapPassword ?? ''}
              onChange={handleChange('imapPassword')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.imapEnabled ?? false}
                  onChange={handleCheckboxChange('imapEnabled')}
                />
              }
              label="Imap Enabled"
              sx={{ flexBasis: '50%' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.imapEnableSsl ?? false}
                  onChange={handleCheckboxChange('imapEnableSsl')}
                />
              }
              label="Imap Enable Ssl"
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label="Smtp Address"
              size="small"
              value={formData.smtpAddress ?? ''}
              onChange={handleChange('smtpAddress')}
            />
            <TextField
              label="Smtp Port"
              type="number"
              size="small"
              value={formData.smtpPort ?? ''}
              onChange={handleChange('smtpPort')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label="Smtp Login"
              size="small"
              value={formData.smtpLogin ?? ''}
              onChange={handleChange('smtpLogin')}
            />
            <TextField
              label="Smtp Password"
              type="password"
              size="small"
              value={formData.smtpPassword ?? ''}
              onChange={handleChange('smtpPassword')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label="Smtp Domain"
              size="small"
              value={formData.smtpDomain ?? ''}
              onChange={handleChange('smtpDomain')}
            />
            <TextField
              label="Smtp Authentication"
              size="small"
              value={formData.smtpAuthentication ?? ''}
              onChange={handleChange('smtpAuthentication')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.smtpEnableSslTls ?? false}
                  onChange={handleCheckboxChange('smtpEnableSslTls')}
                />
              }
              label="Smtp Enable Ssl Tls"
              sx={{ flexBasis: '50%' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.smtpEnabled ?? false}
                  onChange={handleCheckboxChange('smtpEnabled')}
                />
              }
              label="Smtp Enabled"
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.smtpEnableStarttlsAuto ?? false}
                  onChange={handleCheckboxChange('smtpEnableStarttlsAuto')}
                />
              }
              label="Smtp Enable Start tls Auto"
            />
            <TextField
              label="Smtp Openssl Verify Mode"
              size="small"
              value={formData.smtpOpensslVerifyMode ?? ''}
              onChange={handleChange('smtpOpensslVerifyMode')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label="Provider Config"
              size="small"
              value={formData.providerConfig ?? ''}
              onChange={handleChange('providerConfig')}
            />
            <TextField label="Provider" size="small" disabled value={formData.provider ?? ''} />
          </TwoColumnBox>
        </>
      )}

      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(formData, editData?.externalId)}
      >
        Save
      </Button>
    </Box>
  );
};

export const TwoColumnBox = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>{children}</Box>
);
