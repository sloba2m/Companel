import type { Template, TemplatePayload } from 'src/types/templates';

import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Stack,
  Alert,
  Button,
  TextField,
  IconButton,
  Typography,
  AlertTitle,
} from '@mui/material';

import { Editor } from '../editor';
import { Iconify } from '../iconify';
import { Scrollbar } from '../scrollbar';
import { UploadBox } from '../upload-box';

interface TemplatesDrawerProps {
  editData: Template | null;
  onSave: (data: TemplatePayload, id?: string) => void;
  onClose: () => void;
}

export const TemplatesDrawer = ({ editData, onSave, onClose }: TemplatesDrawerProps) => {
  const { t } = useTranslation();

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
    <Scrollbar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          p: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {editData ? t('common.edit') : t('common.create')} {t('templates.fields.template')}
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="mdi:close" />
          </IconButton>
        </Box>

        <TextField
          label={t('templates.fields.name')}
          size="small"
          value={formData.name}
          onChange={handleChange('name')}
        />

        <Alert severity="info">
          <AlertTitle>{t('templates.info.header')}</AlertTitle>
          <Box component="ul" sx={{ pl: 2, listStyleType: 'disc' }}>
            <li>{parse(t('templates.info.name'))}</li>
            <li>{parse(t('templates.info.message'))}</li>
            <li>{parse(t('templates.info.me'))}</li>
            <li>{parse(t('templates.info.logo'))}</li>
          </Box>
        </Alert>

        <Editor
          sx={{ minHeight: 400 }}
          value={formData.template}
          placeholder={`${t('templates.create')}...`}
          onChange={(value) => setFormData((prev) => ({ ...prev, template: value }))}
          isResizible={false}
        />

        <Stack direction="row" spacing={2}>
          <UploadBox
            placeholder={
              <Stack spacing={0.5} alignItems="center">
                <Iconify icon="eva:cloud-upload-fill" width={40} />
                <Typography variant="body2">{t('templates.uploadLogo')}</Typography>
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
          {t('inbox.save')}
        </Button>
        <Button variant="soft" size="small" onClick={onClose}>
          {t('conversations.resolve.cancel')}
        </Button>
      </Box>
    </Scrollbar>
  );
};
