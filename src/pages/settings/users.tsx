import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { UsersDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

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
  const [editData, setEditData] = useState<MockUser | null>(null);
  const drawerState = useBoolean(false);
  const { onToggle: onToggleDrawer } = drawerState;

  const handleEdit = (user: MockUser) => {
    onToggleDrawer();
    setEditData(user);
  };

  const handleDelete = (user: MockUser) => {
    console.log('Delete:', user);
  };

  const columns: GridColDef<MockUser>[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 160,
      sortable: false,
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
        columns={columns}
        createButtonText="Create user"
        rows={mockUsers}
        searchPlaceholder="Search user"
        drawerContent={<UsersDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        drawerState={drawerState}
      />
    </>
  );
}
