import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';

import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { UsersDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Users settings - ${CONFIG.site.name}` };

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob.williams@example.com',
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Davis',
    email: 'charlie.davis@example.com',
  },
];

export default function Page() {
  const tableDrawer = useTableDrawer<MockUser>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const columns: GridColDef<MockUser>[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 160,
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 230,
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
        entity="Users"
        columns={columns}
        rows={mockUsers}
        drawerContent={<UsersDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
      />
    </>
  );
}
