import type { Contact, ContactPayload } from 'src/types/contacts';

import { useState, useEffect } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

interface ContactDrawerProps {
  editData: Contact | null;
  onSave: (data: ContactPayload) => void;
}

export const ContactDrawer = ({ editData, onSave }: ContactDrawerProps) => {
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
      <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} contact</Typography>
      <TextField
        label="Name"
        size="small"
        value={formData.name ?? ''}
        onChange={handleChange('name')}
      />
      <TextField
        label="Phone"
        size="small"
        value={formData.phoneNumber ?? ''}
        onChange={handleChange('phoneNumber')}
      />
      <TextField
        label="Email"
        size="small"
        value={formData.email ?? ''}
        onChange={handleChange('email')}
      />
      <Button variant="soft" color="primary" size="small" onClick={() => onSave(formData)}>
        Save
      </Button>
    </Box>
  );
};
