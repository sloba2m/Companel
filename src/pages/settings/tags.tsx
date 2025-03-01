import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { TagsDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

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
  const [editData, setEditData] = useState<MockTag | null>(null);
  const drawerState = useBoolean(false);
  const { onToggle: onToggleDrawer } = drawerState;

  const handleEdit = (tag: MockTag) => {
    onToggleDrawer();
    setEditData(tag);
  };

  const handleDelete = (tag: MockTag) => {
    console.log('Delete:', tag);
  };

  const columns: GridColDef<MockTag>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      flex: 1,
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
        createButtonText="Create Tag"
        rows={mockTags}
        searchPlaceholder="Search tag"
        drawerContent={<TagsDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        drawerState={drawerState}
      />
    </>
  );
}
