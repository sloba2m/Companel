import type { Contact, ContactPayload } from 'src/types/contacts';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, TextField, Typography } from '@mui/material';

interface ContactDrawerProps {
  editData: Contact | null;
  onSave: (data: ContactPayload, id?: string) => void;
}

export const ContactDrawer = ({ editData, onSave }: ContactDrawerProps) => {
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
      setFormData({ name, phoneNumber, email });
    }
  }, [editData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Typography variant="subtitle1">
        {editData ? t('common.edit') : t('common.create')} {t('contact.create')}
      </Typography>
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
        label={t('contacts.phoneNumber')}
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
    </Box>
  );
};
