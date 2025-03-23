import type { Customer, CustomerPayload } from 'src/types/customers';

import { useState, useEffect } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

interface CustomerDrawerProps {
  editData: Customer | null;
  onSave: (data: CustomerPayload) => void;
}

export const CustomerDrawer = ({ editData, onSave }: CustomerDrawerProps) => {
  const [formData, setFormData] = useState<CustomerPayload>({
    name: '',
    customCustomerId: '',
    phoneNumber: '',
    email: '',
    domain: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const handleChange =
    (field: keyof CustomerPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} customer</Typography>
      <TextField label="Name" size="small" value={formData.name} onChange={handleChange('name')} />
      <TextField
        label="Custom Customer ID"
        size="small"
        value={formData.customCustomerId}
        onChange={handleChange('customCustomerId')}
      />
      <TextField
        label="Phone"
        size="small"
        value={formData.phoneNumber}
        onChange={handleChange('phoneNumber')}
      />
      <TextField
        label="Email"
        size="small"
        value={formData.email}
        onChange={handleChange('email')}
      />
      <TextField
        label="Domain"
        size="small"
        value={formData.domain}
        onChange={handleChange('domain')}
      />
      <Button variant="soft" color="primary" size="small" onClick={() => onSave(formData)}>
        Save
      </Button>
    </Box>
  );
};
