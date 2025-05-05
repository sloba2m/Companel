import type { Contact, ContactPayload } from 'src/types/contacts';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, TextField, IconButton, Typography } from '@mui/material';

import { Iconify } from '../iconify';

interface ContactDrawerProps {
  editData: Contact | null;
  onSave: (data: ContactPayload, id?: string) => void;
  onClose: () => void;
}

export const ContactDrawer = ({ editData, onSave, onClose }: ContactDrawerProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ContactPayload>({
    name: '',
    phoneNumber: '',
    email: '',
  });

  const handleChange =
    (field: keyof ContactPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  useEffect(() => {
    if (editData) {
      const { name, phoneNumber, email } = editData;
      setFormData({ name, phoneNumber: phoneNumber ?? '', email });
    }
  }, [editData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {editData ? t('common.edit') : t('common.create')} {t('contact.create')}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>
      <TextField
        label={t('contacts.name')}
        size="small"
        value={formData.name ?? ''}
        onChange={handleChange('name')}
      />
      <TextField
        label={t('contacts.phoneNumber')}
        size="small"
        value={formData.phoneNumber ?? ''}
        onChange={handleChange('phoneNumber')}
      />
      <TextField
        label={t('contacts.email')}
        size="small"
        type="email"
        value={formData.email ?? ''}
        onChange={handleChange('email')}
      />
      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(formData, editData?.id)}
      >
        {t('contact.save')}
      </Button>
      <Button variant="soft" size="small" onClick={onClose}>
        {t('conversations.resolve.cancel')}
      </Button>
    </Box>
  );
};
