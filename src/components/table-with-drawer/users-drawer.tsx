import { Box, Button, TextField, Typography } from '@mui/material';

export const UsersDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create user</Typography>
    <TextField label="First name" />
    <TextField label="Last name" />
    <TextField label="Email" />
    <Button variant="soft" color="primary">
      Save
    </Button>
  </Box>
);
