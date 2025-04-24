import type { FC } from 'react';
import type { Tag } from 'src/types/tags';

import { useTranslation } from 'react-i18next';

import { Box, Stack, IconButton, ListItemText } from '@mui/material';

import { Iconify } from '../iconify';

interface TagInfoDrawerProps {
  tag: Tag;
  onClose: () => void;
  onEdit: (data: Tag) => void;
}

export const TagInfoDrawer: FC<TagInfoDrawerProps> = ({ tag, onClose, onEdit }) => {
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
        <ListItemText primary={t('tags.fields.name')} secondary={tag.name} />
      </Stack>

      <IconButton onClick={() => onEdit(tag)} sx={{ alignSelf: 'flex-start' }}>
        <Iconify icon="ic:baseline-edit" fontSize="small" />
      </IconButton>
    </Box>
  );
};
