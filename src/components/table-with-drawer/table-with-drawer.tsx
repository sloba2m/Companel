import type { ReactNode } from 'react';
import type { WithId, UseTableDrawerReturn } from 'src/hooks/use-table-drawer';
import type {
  GridColDef,
  GridValidRowModel,
  GridPaginationModel,
  GridCallbackDetails,
} from '@mui/x-data-grid';

import { useTranslation } from 'react-i18next';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Card, Stack, Button, Drawer, TextField, Container, Typography } from '@mui/material';

import { useDebouncedCallback } from 'src/routes/hooks/use-debounce';

import { useResponsive } from 'src/hooks/use-responsive';

interface TableWithDrawerProps<RowData extends GridValidRowModel & WithId> {
  columns: GridColDef<RowData>[];
  rows: RowData[];
  drawerContent: ReactNode;
  entity: string;
  tableDrawer: UseTableDrawerReturn<RowData>;
  isLoading?: boolean;
  isInSubMenu?: boolean;
  paginationModel?: GridPaginationModel;
  totalCount?: number;
  onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails) => void;
  onSearch?: (value: string) => void;
}

const DRAWER_WIDTH = '400px';
const MOBILE_DRAWER_WIDTH = '300px';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const TableWithDrawer = <RowData extends GridValidRowModel & WithId>({
  columns,
  rows,
  drawerContent,
  entity,
  tableDrawer,
  isInSubMenu,
  isLoading,
  paginationModel,
  totalCount,
  onPaginationModelChange,
  onSearch,
}: TableWithDrawerProps<RowData>) => {
  const { t } = useTranslation();
  const mdUp = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch?.(value);
  }, 300);

  return (
    <Container
      maxWidth={false}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1920px',
        my: 4,
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          ml: isInSubMenu && lgUp ? '87px' : 0,
        }}
      >
        <Typography variant="h4">{entity}</Typography>
        <Button
          variant="soft"
          color="primary"
          onClick={() =>
            tableDrawer.isOpenDrawer ? tableDrawer.onCloseDrawer() : tableDrawer.onOpenDrawer()
          }
        >
          {tableDrawer.isOpenDrawer ? t('common.close') : t('common.create')}
        </Button>
      </Box>
      <Card sx={{ display: 'flex', flexGrow: 1, ml: isInSubMenu && lgUp ? '87px' : 0 }}>
        <Stack
          direction="column"
          sx={(theme) => ({
            width: tableDrawer.isOpenDrawer && mdUp ? `calc(100% - ${DRAWER_WIDTH})` : '100%',
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.short,
            }),
          })}
        >
          <Stack
            direction={mdUp ? 'row' : 'column'}
            sx={{ gap: 2, p: 2, justifyContent: onSearch ? 'space-between' : 'flex-end' }}
          >
            {onSearch && (
              <TextField
                size="small"
                placeholder={`${t('common.search')} ${entity.toLowerCase()}`}
                sx={{ width: mdUp ? '400px' : '100%' }}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            )}
          </Stack>
          <DataGrid
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnResize
            sx={{
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
            }}
            pageSizeOptions={paginationModel ? PAGE_SIZE_OPTIONS : []}
            columns={columns}
            rows={rows}
            rowCount={paginationModel ? totalCount : undefined}
            loading={isLoading}
            paginationMode={paginationModel ? 'server' : 'client'}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            slotProps={{
              pagination: {
                labelRowsPerPage: t('common.rowsPerPage'),
              },
            }}
          />
        </Stack>

        {mdUp ? (
          <Box
            sx={(theme) => ({
              minHeight: 0,
              flex: '1 1 auto',
              width: DRAWER_WIDTH,
              display: { xs: 'none', md: 'flex' },
              borderLeft: `solid 1px ${theme.vars.palette.divider}`,
              transition: theme.transitions.create(['width'], {
                duration: theme.transitions.duration.short,
              }),
              ...(!tableDrawer.isOpenDrawer && { width: '0px' }),
            })}
          >
            {tableDrawer.isOpenDrawer && drawerContent}
          </Box>
        ) : (
          <Drawer
            anchor="right"
            open={tableDrawer.isOpenDrawer}
            onClose={tableDrawer.onCloseDrawer}
            slotProps={{ backdrop: { invisible: true } }}
            PaperProps={{ sx: { width: MOBILE_DRAWER_WIDTH } }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Card>
    </Container>
  );
};

export const firstColumnMargin: Partial<GridColDef> = {
  renderHeader: (param) => <Box sx={{ ml: 1 }}>{param.colDef.headerName}</Box>,
  renderCell: (param) => <Box sx={{ ml: 1 }}>{param.row.name}</Box>,
};
