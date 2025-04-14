import type { FC } from 'react';

import React from 'react';

import { ListItemText } from '@mui/material';

interface ListItemInfoProps {
  primary: string;
  secondary?: string | null;
}

export const ListItemInfo: FC<ListItemInfoProps> = ({ primary, secondary }) => (
  <ListItemText
    primary={primary}
    secondary={secondary ?? '-'}
    sx={{ pb: 1, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
  />
);
