import type { GridColDef } from '@mui/x-data-grid';

import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { CONFIG } from 'src/config-global';

import { UsersDrawer, TableWithDrawer } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Users settings - ${CONFIG.site.name}` };

interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

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
  },
];

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
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableWithDrawer
          columns={columns}
          createButtonText="Create user"
          rows={mockUsers}
          searchPlaceholder="Search contact"
          drawerContent={<UsersDrawer />}
        />
      </Container>
    </>
  );
}
