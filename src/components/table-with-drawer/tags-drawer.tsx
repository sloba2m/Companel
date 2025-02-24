import { Box, Button, TextField, Typography } from '@mui/material';

export const TagsDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create tag</Typography>
    <TextField label="Name" />
    <Button variant="soft" color="primary">
      Save
    </Button>
  </Box>
);
