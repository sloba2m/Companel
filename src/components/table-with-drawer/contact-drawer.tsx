import type { MockContact } from 'src/pages/contacts';

import { Box, Button, TextField, Typography } from '@mui/material';

interface ContactDrawerProps {
  editData: MockContact | null;
}

export const ContactDrawer = ({ editData }: ContactDrawerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} contact</Typography>
    <TextField label="Name" size="small" defaultValue={editData?.name} />
    <TextField label="Phone" size="small" defaultValue={editData?.phone} />
    <TextField label="Email" size="small" defaultValue={editData?.email} />
    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
