import type { MockUser } from 'src/pages/settings/users';

import { Box, Button, TextField, Typography } from '@mui/material';

interface UsersDrawerProps {
  editData: MockUser | null;
}

export const UsersDrawer = ({ editData }: UsersDrawerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} user</Typography>
    <TextField label="First name" size="small" defaultValue={editData?.firstName} />
    <TextField label="Last name" size="small" defaultValue={editData?.lastName} />
    <TextField label="Email" size="small" defaultValue={editData?.email} />
    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
