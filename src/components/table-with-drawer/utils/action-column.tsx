import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

import i18next from 'i18next';

import { IconButton } from '@mui/material';

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
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onEdit(params.row);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
            />
          </svg>
        </IconButton>
        {onDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(params.row);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
              />
            </svg>
          </IconButton>
        )}
      </>
    ),
  };
}
