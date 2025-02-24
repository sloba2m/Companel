import { Box, Button, TextField, Typography } from '@mui/material';

export const ContactDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create contact</Typography>
    <TextField label="Name" size="small" />
    <TextField label="Phone" size="small" />
    <TextField label="Email" size="small" />
    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
