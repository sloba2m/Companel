import type { MockTemplate } from 'src/pages/settings/templates';

import { Box, Stack, Alert, Button, TextField, Typography, AlertTitle } from '@mui/material';

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

    <Alert severity="info">
      <AlertTitle>Available directives for dynamic fields</AlertTitle>
      <Box component="ul" sx={{ pl: 2, listStyleType: 'disc' }}>
        <li>
          Use <strong>[name]</strong> to substitute for the contact&apos;s name
        </li>
        <li>
          Use <strong>[message]</strong> to substitute for the agent message
        </li>
        <li>
          Use <strong>[me]</strong> to substitute for the agent&apos;s name
        </li>
        <li>
          Use <strong>[logo]</strong> to substitute for the uploaded logo
        </li>
      </Box>
    </Alert>

    {/* Editor for Template Content */}
    <Editor sx={{ minHeight: 400 }} value={editData?.template} placeholder="Create template..." />

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
