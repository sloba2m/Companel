import type { MockUser } from 'src/pages/settings/users';

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

    <Card sx={(theme) => ({ p: 2, backgroundColor: theme.vars.palette.primary.lighter })}>
      <FormGroup>
        <FormControlLabel control={<Switch />} label="default-roles-comunication-platform" />
        <FormControlLabel control={<Switch />} label="Administrator" />
        <FormControlLabel control={<Switch />} label="uma_authorization" />
        <FormControlLabel control={<Switch />} label="agent" />
        <FormControlLabel control={<Switch />} label="offline_access" />
      </FormGroup>
    </Card>
  </Box>
);
