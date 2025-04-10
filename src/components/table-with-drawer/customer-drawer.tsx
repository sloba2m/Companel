import type { Customer, CustomerPayload } from 'src/types/customers';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, TextField, IconButton, Typography } from '@mui/material';

import { Iconify } from '../iconify';

interface CustomerDrawerProps {
  editData: Customer | null;
  onSave: (data: CustomerPayload, id?: string) => void;
  onClose: () => void;
}

export const CustomerDrawer = ({ editData, onSave, onClose }: CustomerDrawerProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<CustomerPayload>({
    name: '',
    customCustomerId: '',
    phoneNumber: '',
    email: '',
    domain: '',
  });

  useEffect(() => {
    if (editData) {
      const { name, customCustomerId, phoneNumber, email, domain } = editData;
      setFormData({ name, customCustomerId, phoneNumber, email, domain });
    }
  }, [editData]);

  const handleChange =
    (field: keyof CustomerPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {editData ? t('common.edit') : t('common.create')} {t('customer.create')}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>
      <TextField
        label={t('customer.name')}
        size="small"
        value={formData.name}
        onChange={handleChange('name')}
      />
      <TextField
        label={t('customer.customCustomerId')}
        size="small"
        value={formData.customCustomerId}
        onChange={handleChange('customCustomerId')}
      />
      <TextField
        label={t('customer.phoneNumber')}
        size="small"
        value={formData.phoneNumber}
        onChange={handleChange('phoneNumber')}
      />
      <TextField
        label={t('customer.email')}
        size="small"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
      />
      <TextField
        label={t('customer.domain')}
        size="small"
        value={formData.domain}
        onChange={handleChange('domain')}
      />
      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(formData, editData?.id)}
      >
        {t('customer.save')}
      </Button>
    </Box>
  );
};
