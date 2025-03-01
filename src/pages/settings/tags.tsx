import type { GridColDef } from '@mui/x-data-grid';

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TagsDrawer, TableWithDrawer } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Tags settings - ${CONFIG.site.name}` };

interface MockTags {
  id: string;
  name: string;
}

const tags: MockTags[] = [
  { id: '1', name: 'Tag one' },
  { id: '2', name: 'Tag two' },
];

const columns: GridColDef<MockTags>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 160,
    sortable: false,
  },
];

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        columns={columns}
        createButtonText="Create Tag"
        rows={tags}
        searchPlaceholder="Search contact"
        drawerContent={<TagsDrawer />}
      />
    </>
  );
}
