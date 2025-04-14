import type { FC } from 'react';
import type { Contact } from 'src/types/contacts';

import { useTranslation } from 'react-i18next';

import { Box, IconButton, ListItemText } from '@mui/material';

import { Iconify } from '../iconify';

interface ContactInfoDrawerProps {
  contact: Contact;
  onClose: () => void;
}

export const ContactInfoDrawer: FC<ContactInfoDrawerProps> = ({ contact, onClose }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>
      <ListItemText primary={t('contacts.name')} secondary={contact.name} />
      <ListItemText primary={t('contacts.phoneNumber')} secondary={contact.phoneNumber} />
      <ListItemText primary={t('contacts.email')} secondary={contact.email} />
    </Box>
  );
};
