import type { User } from 'src/types/users';

import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Stack, Switch, FormGroup, IconButton, FormControlLabel } from '@mui/material';

import { varAlpha, stylesMode } from 'src/theme/styles';
import { useGetRoles, useGetUserRoles } from 'src/actions/users';

import { Iconify } from '../iconify';
import { ListItemInfo } from './utils/list-item-info';

interface UserInfoDrawerProps {
  user: User;
  onClose: () => void;
  onEdit: (data: User) => void;
}

export const UserInfoDrawer: FC<UserInfoDrawerProps> = ({ user, onClose, onEdit }) => {
  const { t } = useTranslation();

  const { data: rolesData } = useGetRoles(true);
  const { data: userRolesData } = useGetUserRoles(user.id);

  const userRoles = useMemo(() => userRolesData?.map((role) => role.id) ?? [], [userRolesData]);

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
        <ListItemInfo primary={t('user.firstName')} secondary={user.firstName} />
        <ListItemInfo primary={t('user.lastName')} secondary={user.lastName} />
        <ListItemInfo primary={t('user.email')} secondary={user.email} />
      </Stack>
      <Card
        sx={(theme) => ({
          p: 2,
          backgroundColor: theme.vars.palette.primary.lighter,
          [stylesMode.dark]: {
            backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.1),
          },
        })}
      >
        <FormGroup>
          {rolesData?.map((role) => (
            <FormControlLabel
              key={role.id}
              control={
                <Switch checked={userRoles?.some((id) => id === role.id) ?? false} disabled />
              }
              label={role.name}
            />
          ))}
        </FormGroup>
      </Card>
      <IconButton onClick={() => onEdit(user)} sx={{ alignSelf: 'flex-start' }}>
        <Iconify icon="ic:baseline-edit" fontSize="small" />
      </IconButton>
    </Box>
  );
};
