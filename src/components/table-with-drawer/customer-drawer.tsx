import { Box, Button, TextField, Typography } from '@mui/material';

export const CustomerDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create customer</Typography>
    <TextField label="Name" />
    <TextField label="Custom Customer ID" />
    <TextField label="Phone" />
    <TextField label="Email" />
    <TextField label="Domain" />
    <Button variant="soft" color="primary">
      Save
    </Button>
  </Box>
);
