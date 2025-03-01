import type { ReactNode } from 'react';
import type { UseBooleanReturn } from 'src/hooks/use-boolean';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Card, Stack, Button, Drawer, TextField, Container, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

interface TableWithDrawerProps<RowData extends GridValidRowModel> {
  columns: GridColDef<RowData>[];
  rows: RowData[];
  drawerContent: ReactNode;
  entity: string;
  drawerState: UseBooleanReturn;
  onSearch?: () => void;
}

const DRAWER_WIDTH = '400px';
const MOBILE_DRAWER_WIDTH = '300px';

export const TableWithDrawer = <RowData extends GridValidRowModel>({
  columns,
  rows,
  drawerContent,
  entity,
  drawerState,
  onSearch,
}: TableWithDrawerProps<RowData>) => {
  const mdUp = useResponsive('up', 'md');
  const { value: isDrawerOpen, onToggle: onToggleDrawer } = drawerState;

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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="h4">{entity}</Typography>
        <Button variant="soft" color="primary" onClick={onToggleDrawer}>
          Create
        </Button>
      </Box>
      <Card sx={{ display: 'flex', flexGrow: 1 }}>
        <Stack direction="column" sx={{ width: '100%' }}>
          <Stack
            direction={mdUp ? 'row' : 'column'}
            sx={{ gap: 2, p: 2, justifyContent: onSearch ? 'space-between' : 'flex-end' }}
          >
            {onSearch && (
              <TextField
                placeholder={`Search ${entity.toLowerCase()}`}
                sx={{ width: mdUp ? '400px' : '100%' }}
              />
            )}
          </Stack>
          <DataGrid
            columns={columns}
            rows={rows}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnResize
          />
        </Stack>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={onToggleDrawer}
          slotProps={{ backdrop: { invisible: true } }}
          PaperProps={{ sx: { width: mdUp ? DRAWER_WIDTH : MOBILE_DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      </Card>
    </Container>
  );
};
