import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';

import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { TagsDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Tags settings - ${CONFIG.site.name}` };

export interface MockTag {
  id: string;
  name: string;
}

const mockTags: MockTag[] = [
  { id: '1', name: 'Tag one' },
  { id: '2', name: 'Tag two' },
];

export default function Page() {
  const tableDrawer = useTableDrawer<MockTag>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const columns: GridColDef<MockTag>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      flex: 1,
      ...firstColumnMargin,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        columns={columns}
        entity="Tags"
        rows={mockTags}
        drawerContent={<TagsDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
      />
    </>
  );
}
