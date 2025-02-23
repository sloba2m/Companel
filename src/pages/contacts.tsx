import type { GridColDef } from '@mui/x-data-grid';

import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { ContactDrawer, TableWithDrawer } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Contacts` };

const columns: GridColDef<MockContact>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 160,
    sortable: false,
  },
  {
    field: 'phone',
    headerName: 'Phone number',
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

interface MockContact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const mockContacts: MockContact[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1 555-123-4567',
    email: 'john.doe@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1 555-987-6543',
    email: 'jane.smith@example.com',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    phone: '+1 555-456-7890',
    email: 'michael.johnson@example.com',
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
          createButtonText="Create contact"
          rows={mockContacts}
          searchPlaceholder="Search contact"
          drawerContent={<ContactDrawer />}
        />
      </Container>
    </>
  );
}
