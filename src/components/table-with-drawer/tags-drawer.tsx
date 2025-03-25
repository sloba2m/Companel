import type { Tag } from 'src/types/tags';

import { useState, useEffect } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

interface TagsDrawerProps {
  editData: Tag | null;
  onSave: (name: string, id?: string) => void;
}

export const TagsDrawer = ({ editData, onSave }: TagsDrawerProps) => {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    }
  }, [editData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
      <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} tag</Typography>
      <TextField label="Name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
      <Button
        variant="soft"
        color="primary"
        size="small"
        onClick={() => onSave(name, editData?.id)}
      >
        Save
      </Button>
    </Box>
  );
};
