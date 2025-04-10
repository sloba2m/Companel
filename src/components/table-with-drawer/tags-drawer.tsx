import type { Tag } from 'src/types/tags';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, TextField, IconButton, Typography } from '@mui/material';

import { Iconify } from '../iconify';

interface TagsDrawerProps {
  editData: Tag | null;
  onSave: (name: string, id?: string) => void;
  onClose: () => void;
}

export const TagsDrawer = ({ editData, onSave, onClose }: TagsDrawerProps) => {
  const { t } = useTranslation();

  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    }
  }, [editData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {editData ? t('common.edit') : t('common.create')} {t('tags.create')}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mdi:close" />
        </IconButton>
      </Box>
      <TextField
        label={t('tags.fields.name')}
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(name, editData?.id)}
      >
        {t('tags.save')}
      </Button>
    </Box>
  );
};
