import type { MockCustomer } from 'src/pages/customers';

import { Box, Button, TextField, Typography } from '@mui/material';

interface CustomerDrawerProps {
  editData: MockCustomer | null;
}

export const CustomerDrawer = ({ editData }: CustomerDrawerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} customer</Typography>
    <TextField label="Name" size="small" defaultValue={editData?.name} />
    <TextField label="Custom Customer ID" size="small" defaultValue={editData?.id} />
    <TextField label="Phone" size="small" defaultValue={editData?.phone} />
    <TextField label="Email" size="small" defaultValue={editData?.email} />
    <TextField label="Domain" size="small" defaultValue={editData?.domain} />
    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
