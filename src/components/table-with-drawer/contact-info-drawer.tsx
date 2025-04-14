import type { FC } from 'react';
import type { Contact } from 'src/types/contacts';

import { useTranslation } from 'react-i18next';

import { Box, Stack, Button, IconButton, ListItemText } from '@mui/material';

import { Iconify } from '../iconify';

interface ContactInfoDrawerProps {
  contact: Contact;
  onClose: () => void;
  onEdit: (data: Contact) => void;
}

export const ContactInfoDrawer: FC<ContactInfoDrawerProps> = ({ contact, onClose, onEdit }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 2,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>
      <Stack sx={{ gap: 1 }}>
        <ListItemText
          primary={t('contacts.name')}
          sx={{ pb: 1, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
          secondary={contact.name}
        />
        <ListItemText
          primary={t('contacts.phoneNumber')}
          secondary={contact.phoneNumber ?? '-'}
          sx={{ pb: 1, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
        />
        <ListItemText
          primary={t('contacts.email')}
          secondary={contact.email}
          sx={{ pb: 1, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
        />
      </Stack>
      <Button
        sx={{ alignSelf: 'flex-start' }}
        variant="soft"
        color="primary"
        onClick={() => onEdit(contact)}
      >
        Edit
      </Button>
    </Box>
  );
};
