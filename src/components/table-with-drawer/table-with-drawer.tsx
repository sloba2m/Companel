import type { ReactNode } from 'react';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Card, Stack, Button, Drawer, useTheme, TextField } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

interface TableWithDrawerProps<RowData extends GridValidRowModel> {
  columns: GridColDef<RowData>[];
  rows: RowData[];
  drawerContent: ReactNode;
  createButtonText: string;
  searchPlaceholder?: string;
  onSearch?: () => void;
}

const DRAWER_WIDTH = '400px';
const MOBILE_DRAWER_WIDTH = '300px';

export const TableWithDrawer = <RowData extends GridValidRowModel>({
  columns,
  rows,
  drawerContent,
  createButtonText,
  searchPlaceholder,
  onSearch,
}: TableWithDrawerProps<RowData>) => {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const { value: isDrawerOpen, onToggle: onToggleDrawer } = useBoolean(false);

  return (
    <Card sx={{ display: 'flex', flexGrow: 1, mb: 4 }}>
      <Stack
        direction="column"
        sx={{
          width: isDrawerOpen && mdUp ? `calc(100% - ${DRAWER_WIDTH})` : '100%',
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <Stack
          direction={mdUp ? 'row' : 'column'}
          sx={{ gap: 2, p: 2, justifyContent: onSearch ? 'space-between' : 'flex-end' }}
        >
          {onSearch && (
            <TextField placeholder={searchPlaceholder} sx={{ width: mdUp ? '400px' : '100%' }} />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="soft" color="primary" onClick={onToggleDrawer}>
              {isDrawerOpen ? 'Close' : createButtonText}
            </Button>
          </Box>
        </Stack>
        <DataGrid
          columns={columns}
          rows={rows}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnResize
        />
      </Stack>
      {mdUp ? (
        <Box
          sx={{
            minHeight: 0,
            flex: '1 1 auto',
            width: DRAWER_WIDTH,
            display: { xs: 'none', lg: 'flex' },
            borderLeft: `solid 1px ${theme.vars.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(!isDrawerOpen && { width: '0px' }),
          }}
        >
          {isDrawerOpen && drawerContent}
        </Box>
      ) : (
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={onToggleDrawer}
          slotProps={{ backdrop: { invisible: true } }}
          PaperProps={{ sx: { width: MOBILE_DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Card>
  );
};
