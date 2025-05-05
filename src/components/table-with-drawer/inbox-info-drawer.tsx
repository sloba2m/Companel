import type { FC } from 'react';
import type { InboxWithId } from 'src/pages/settings/inbox';

import { useTranslation } from 'react-i18next';

import { Box, Stack, IconButton } from '@mui/material';

import { Iconify } from '../iconify';
import { ListItemInfo } from './utils/list-item-info';

interface InboxInfoDrawerProps {
  inbox: InboxWithId;
  onClose: () => void;
  onEdit: (data: InboxWithId) => void;
}

export const InboxInfoDrawer: FC<InboxInfoDrawerProps> = ({ inbox, onClose, onEdit }) => {
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
        <ListItemInfo primary={t('inbox.name')} secondary={inbox.name} />
        <ListItemInfo primary={t('inbox.email')} secondary={inbox.emailAddress} />
        <ListItemInfo
          primary={t('inbox.fields.providerLabel')}
          secondary={inbox.emailChannel.provider}
        />
        <ListItemInfo
          primary={t('inbox.fields.emailTemplate')}
          secondary={inbox.emailTemplate?.name ?? '-'}
        />
        {inbox.emailChannel.provider === 'MICROSOFT_OAUTH' ? (
          <>
            <ListItemInfo
              primary={t('inbox.fields.tenantIdLabel')}
              secondary={inbox.emailChannel.tenantId}
            />
            <ListItemInfo
              primary={t('inbox.fields.clientIdLabel')}
              secondary={inbox.emailChannel.clientId}
            />
            <ListItemInfo primary={t('inbox.fields.clientSecretLabel')} secondary="••••••••" />
          </>
        ) : (
          <>
            <ListItemInfo
              primary={t('inbox.fields.imapAddressLabel')}
              secondary={inbox.emailChannel.imapAddress}
            />
            <ListItemInfo
              primary={t('inbox.fields.imapPortLabel')}
              secondary={inbox.emailChannel.imapPort?.toString()}
            />
            <ListItemInfo
              primary={t('inbox.fields.imapLoginLabel')}
              secondary={inbox.emailChannel.imapLogin}
            />
            <ListItemInfo
              primary={t('inbox.fields.smtpAddressLabel')}
              secondary={inbox.emailChannel.smtpAddress}
            />
            <ListItemInfo
              primary={t('inbox.fields.smtpPortLabel')}
              secondary={inbox.emailChannel.smtpPort?.toString()}
            />
            <ListItemInfo
              primary={t('inbox.fields.smtpLoginLabel')}
              secondary={inbox.emailChannel.smtpLogin}
            />
            <ListItemInfo
              primary={t('inbox.fields.smtpDomainLabel')}
              secondary={inbox.emailChannel.smtpDomain}
            />
          </>
        )}
      </Stack>
    </Box>
  );
};
