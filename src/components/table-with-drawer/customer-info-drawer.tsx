import type { FC } from 'react';
import type { Customer } from 'src/types/customers';

import { useTranslation } from 'react-i18next';

import { Box, Stack, IconButton } from '@mui/material';

import { Iconify } from '../iconify';
import { ListItemInfo } from './utils/list-item-info';

interface CustomerInfoDrawerProps {
  customer: Customer;
  onClose: () => void;
  onEdit: (data: Customer) => void;
}

export const CustomerInfoDrawer: FC<CustomerInfoDrawerProps> = ({ customer, onClose, onEdit }) => {
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
        <ListItemInfo primary={t('customer.name')} secondary={customer.name} />
        <ListItemInfo
          primary={t('customer.customCustomerId')}
          secondary={customer.customCustomerId}
        />
        <ListItemInfo primary={t('customer.phoneNumber')} secondary={customer.phoneNumber} />
        <ListItemInfo primary={t('customer.email')} secondary={customer.email} />
        <ListItemInfo primary={t('customer.domain')} secondary={customer.domain} />
      </Stack>
      <IconButton onClick={() => onEdit(customer)} sx={{ alignSelf: 'flex-start' }}>
        <Iconify icon="ic:baseline-edit" fontSize="small" />
      </IconButton>
    </Box>
  );
};
