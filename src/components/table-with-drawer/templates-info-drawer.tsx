import type { FC } from 'react';
import type { Template } from 'src/types/templates';

import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';

import { Box, Stack, IconButton, Typography } from '@mui/material';

import { Iconify } from '../iconify';
import { ListItemInfo } from './utils/list-item-info';

interface TemplateInfoDrawerProps {
  template: Template;
  onClose: () => void;
  onEdit: (data: Template) => void;
}

export const TemplateInfoDrawer: FC<TemplateInfoDrawerProps> = ({ template, onClose, onEdit }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 2,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>

      <Stack sx={{ gap: 1 }}>
        <ListItemInfo primary={t('templates.fields.name')} secondary={template.name} />
        <Box sx={{ pb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {t('templates.fields.template')}
          </Typography>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              bgcolor: 'background.paper',
            }}
          >
            {parse(template.template)}
          </Box>
        </Box>
        {template.logoUrl && (
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {t('templates.fields.logo')}
            </Typography>
            <img
              src={template.logoUrl}
              alt="Logo"
              height={120}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          </Box>
        )}
      </Stack>

      <IconButton onClick={() => onEdit(template)} sx={{ alignSelf: 'flex-start' }}>
        <Iconify icon="ic:baseline-edit" fontSize="small" />
      </IconButton>
    </Box>
  );
};
