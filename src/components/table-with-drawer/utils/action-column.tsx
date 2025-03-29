import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

import i18next from 'i18next';

import { IconButton } from '@mui/material';

import { Iconify } from '../../iconify';

export function getActionColumn<T extends GridValidRowModel>(
  onEdit: (row: T) => void,
  onDelete?: (row: T) => void
): GridColDef<T> {
  return {
    field: 'actions',
    headerName: i18next.t('common.actions'),
    width: 100,
    sortable: false,
    align: 'right',
    headerAlign: 'center',
    renderCell: (params) => (
      <>
        <IconButton onClick={() => onEdit(params.row)}>
          <Iconify icon="mdi:edit" />
        </IconButton>
        {onDelete && (
          <IconButton onClick={() => onDelete(params.row)}>
            <Iconify icon="mdi:delete" />
          </IconButton>
        )}
      </>
    ),
  };
}
