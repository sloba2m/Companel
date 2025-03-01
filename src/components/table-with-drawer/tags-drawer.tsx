import type { MockTag } from 'src/pages/settings/tags';

import { Box, Button, TextField, Typography } from '@mui/material';

interface TagsDrawerProps {
  editData: MockTag | null;
}

export const TagsDrawer = ({ editData }: TagsDrawerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} tag</Typography>
    <TextField label="Name" size="small" defaultValue={editData?.name} />
    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
