import type { User, UserPayload } from 'src/types/users';

import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Button,
  Switch,
  FormGroup,
  TextField,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { stylesMode } from 'src/theme/styles';
import { useGetRoles, useGetUserRoles, useUpdateUserRole } from 'src/actions/users';

interface UsersDrawerProps {
  editData: User | null;
  onSave: (data: UserPayload, id?: string) => void;
}

export const UsersDrawer = ({ editData, onSave }: UsersDrawerProps) => {
  const [formData, setFormData] = useState<UserPayload>({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
      });
    }
  }, [editData]);

  const handleChange = (field: keyof UserPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const { data: rolesData } = useGetRoles(!!editData);
  const { data: userRolesData } = useGetUserRoles(editData?.id);
  const { mutate: userRoleMutation } = useUpdateUserRole();

  const [userRoles, setUserRoles] = useState<string[]>(userRolesData?.map((r) => r.id) ?? []);

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (!editData?.id) return;
    setUserRoles((prev) => (checked ? [...prev, roleId] : prev.filter((id) => id !== roleId)));
    userRoleMutation({ action: checked ? 'assign' : 'revoke', roleId, userId: editData.id });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} user</Typography>

      <TextField
        label="First name"
        size="small"
        value={formData.firstName}
        onChange={handleChange('firstName')}
      />

      <TextField
        label="Last name"
        size="small"
        value={formData.lastName}
        onChange={handleChange('lastName')}
      />

      <TextField
        label="Email"
        size="small"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
      />

      {editData && (
        <Card
          sx={(theme) => ({
            p: 2,
            backgroundColor: theme.vars.palette.primary.lighter,
            [stylesMode.dark]: { backgroundColor: theme.vars.palette.primary.dark },
          })}
        >
          <FormGroup>
            {rolesData?.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Switch
                    checked={userRoles?.some((id) => id === role.id) ?? false}
                    onChange={(e) => handleRoleToggle(role.id, e.target.checked)}
                  />
                }
                label={role.name}
              />
            ))}
          </FormGroup>
        </Card>
      )}

      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(formData, editData?.id)}
      >
        Save
      </Button>
    </Box>
  );
};
