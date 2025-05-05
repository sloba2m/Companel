import type { ReactNode } from 'react';
import type { Inbox, InboxPayload, EmailProvider } from 'src/types/inbox';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { useGetTemplates } from 'src/actions/templates';

import { Iconify } from '../iconify';

interface InboxDrawerProps {
  editData: Inbox | null;
  onSave: (data: InboxPayload, id?: string) => void;
  onClose: () => void;
}

const typeOptions: EmailProvider[] = ['MICROSOFT_OAUTH', 'MICROSOFT_BASIC'];

export const InboxDrawer = ({ editData, onSave, onClose }: InboxDrawerProps) => {
  const { t } = useTranslation();

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {editData ? t('common.edit') : t('common.create')} {t('inbox.inboxInfo')}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>

      <TwoColumnBox>
        <Autocomplete
          fullWidth
          options={typeOptions}
          disabled={!!editData}
          value={formData.provider ?? 'MICROSOFT_OAUTH'}
          disableClearable
          onChange={(_e, val) => setFormData((prev) => ({ ...prev, provider: val }))}
          renderInput={(params) => (
            <TextField {...params} label={t('inbox.fields.typeLabel')} margin="none" size="small" />
          )}
        />
        <Autocomplete
          fullWidth
          options={templatesData ?? []}
          getOptionLabel={(option) => option.name}
          value={templatesData?.find((te) => te.id === formData.emailTemplateId) ?? null}
          onChange={(_e, val) =>
            setFormData((prev) => ({ ...prev, emailTemplateId: val?.id ?? null }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('inbox.fields.emailTemplate')}
              margin="none"
              size="small"
            />
          )}
        />
      </TwoColumnBox>

      <TwoColumnBox>
        <TextField
          label={t('inbox.name')}
          size="small"
          value={formData.name ?? ''}
          onChange={handleChange('name')}
        />
        <TextField
          label={t('inbox.email')}
          size="small"
          value={formData.email ?? ''}
          onChange={handleChange('email')}
        />
      </TwoColumnBox>

      {formData.provider === 'MICROSOFT_OAUTH' ? (
        <>
          <TextField
            label={t('inbox.fields.tenantIdLabel')}
            size="small"
            value={formData.tenantId ?? ''}
            onChange={handleChange('tenantId')}
          />
          <TextField
            label={t('inbox.fields.clientIdLabel')}
            size="small"
            value={formData.clientId ?? ''}
            onChange={handleChange('clientId')}
          />
          <TextField
            label={t('inbox.fields.clientSecretLabel')}
            size="small"
            value={formData.clientSecret ?? ''}
            onChange={handleChange('clientSecret')}
          />
        </>
      ) : (
        <>
          <TwoColumnBox>
            <TextField
              label={t('inbox.fields.imapAddressLabel')}
              size="small"
              value={formData.imapAddress ?? ''}
              onChange={handleChange('imapAddress')}
            />
            <TextField
              label={t('inbox.fields.imapPortLabel')}
              type="number"
              size="small"
              value={formData.imapPort ?? ''}
              onChange={handleChange('imapPort')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label={t('inbox.fields.imapLoginLabel')}
              size="small"
              value={formData.imapLogin ?? ''}
              onChange={handleChange('imapLogin')}
            />
            <TextField
              label={t('inbox.fields.imapPasswordLabel')}
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
              label={t('inbox.fields.imapEnabledLabel')}
              sx={{ flexBasis: '50%' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.imapEnableSsl ?? false}
                  onChange={handleCheckboxChange('imapEnableSsl')}
                />
              }
              label={t('inbox.fields.imapEnableSslLabel')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label={t('inbox.fields.smtpAddressLabel')}
              size="small"
              value={formData.smtpAddress ?? ''}
              onChange={handleChange('smtpAddress')}
            />
            <TextField
              label={t('inbox.fields.smtpPortLabel')}
              type="number"
              size="small"
              value={formData.smtpPort ?? ''}
              onChange={handleChange('smtpPort')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label={t('inbox.fields.smtpLoginLabel')}
              size="small"
              value={formData.smtpLogin ?? ''}
              onChange={handleChange('smtpLogin')}
            />
            <TextField
              label={t('inbox.fields.smtpAddressLabel')}
              type="password"
              size="small"
              value={formData.smtpPassword ?? ''}
              onChange={handleChange('smtpPassword')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label={t('inbox.fields.smtpDomainLabel')}
              size="small"
              value={formData.smtpDomain ?? ''}
              onChange={handleChange('smtpDomain')}
            />
            <TextField
              label={t('inbox.fields.smtpAuthenticationLabel')}
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
              label={t('inbox.fields.smtpEnableSslTlsLabel')}
              sx={{ flexBasis: '50%' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.smtpEnabled ?? false}
                  onChange={handleCheckboxChange('smtpEnabled')}
                />
              }
              label={t('inbox.fields.smtpEnabledLabel')}
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
              label={t('inbox.fields.smtpEnableStarttlsAutoLabel')}
            />
            <TextField
              label={t('inbox.fields.smtpOpensslVerifyModeLabel')}
              size="small"
              value={formData.smtpOpensslVerifyMode ?? ''}
              onChange={handleChange('smtpOpensslVerifyMode')}
            />
          </TwoColumnBox>
          <TwoColumnBox>
            <TextField
              label={t('inbox.fields.providerConfigLabel')}
              size="small"
              value={formData.providerConfig ?? ''}
              onChange={handleChange('providerConfig')}
            />
            <TextField
              label={t('inbox.fields.providerLabel')}
              size="small"
              disabled
              value={formData.provider ?? ''}
            />
          </TwoColumnBox>
        </>
      )}

      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(formData, editData?.externalId)}
      >
        {t('inbox.save')}
      </Button>
      <Button variant="soft" size="small" onClick={onClose}>
        {t('conversations.resolve.cancel')}
      </Button>
    </Box>
  );
};

export const TwoColumnBox = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>{children}</Box>
);
