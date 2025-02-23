import { Box, Stack, Button, TextField, Typography } from '@mui/material';

import { Editor } from '../editor';
import { Iconify } from '../iconify';
import { UploadBox } from '../upload-box';

export const TemplatesDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create template</Typography>
    <TextField label="Name" />
    <Editor sx={{ minHeight: 400 }} />
    <Stack direction="row" spacing={2}>
      <UploadBox
        placeholder={
          <Stack spacing={0.5} alignItems="center">
            <Iconify icon="eva:cloud-upload-fill" width={40} />
            <Typography variant="body2">Upload logo</Typography>
          </Stack>
        }
        sx={{ py: 1, flexGrow: 1, height: 'auto' }}
      />
    </Stack>
    <Button variant="soft" color="primary">
      Save
    </Button>
  </Box>
);
