import type { Template, TemplatePayload } from 'src/types/templates';

import { useState, useEffect } from 'react';

import { Box, Stack, Alert, Button, TextField, Typography, AlertTitle } from '@mui/material';

import { Editor } from '../editor';
import { Iconify } from '../iconify';
import { UploadBox } from '../upload-box';

interface TemplatesDrawerProps {
  editData: Template | null;
  onSave: (data: TemplatePayload, id?: string) => void;
}

export const TemplatesDrawer = ({ editData, onSave }: TemplatesDrawerProps) => {
  const [formData, setFormData] = useState<TemplatePayload>({
    name: '',
    template: '',
    logoFile: null,
  });

  useEffect(() => {
    if (editData) {
      const { name, template, logoUrl } = editData;
      setFormData({ name, template, logoUrl });
    }
  }, [editData]);

  const handleChange =
    (field: keyof TemplatePayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const imageToDisplay = formData.logoFile
    ? URL.createObjectURL(formData.logoFile)
    : editData?.logoUrl;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} template</Typography>

      <TextField label="Name" size="small" value={formData.name} onChange={handleChange('name')} />

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

      <Editor
        sx={{ minHeight: 400 }}
        value={formData.template}
        placeholder="Create template..."
        onChange={(value) => setFormData((prev) => ({ ...prev, template: value }))}
      />

      <Stack direction="row" spacing={2}>
        <UploadBox
          placeholder={
            <Stack spacing={0.5} alignItems="center">
              <Iconify icon="eva:cloud-upload-fill" width={40} />
              <Typography variant="body2">Upload logo</Typography>
            </Stack>
          }
          sx={{ py: 1, flexGrow: 1, height: 'auto' }}
          maxSize={5 * 1024 * 1024}
          accept={{
            'image/svg+xml': ['.svg'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif'],
          }}
          multiple={false}
          onDrop={(acceptedFiles) => {
            if (acceptedFiles.length > 0) {
              const file = acceptedFiles[0];
              setFormData((prev) => ({ ...prev, logoFile: file }));
            }
          }}
        />
      </Stack>

      {imageToDisplay && (
        <img src={imageToDisplay} height={120} alt="Logo" style={{ objectFit: 'cover' }} />
      )}

      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(formData, editData?.id)}
      >
        Save
      </Button>
    </Box>
  );
};
