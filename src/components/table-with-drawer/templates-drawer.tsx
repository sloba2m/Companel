import type { MockTemplate } from 'src/pages/settings/templates';

import { Box, Stack, Button, TextField, Typography } from '@mui/material';

import { Editor } from '../editor';
import { Iconify } from '../iconify';
import { UploadBox } from '../upload-box';

interface TemplatesDrawerProps {
  editData: MockTemplate | null;
}

export const TemplatesDrawer = ({ editData }: TemplatesDrawerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} template</Typography>

    <TextField label="Name" size="small" defaultValue={editData?.name} />

    {/* Editor for Template Content */}
    <Editor sx={{ minHeight: 400 }} value={editData?.template} />

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

    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
