import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';

import { CustomerDrawer, TableWithDrawer } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Customers` };

const columns: GridColDef<MockCustomer>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 160,
    sortable: false,
  },
  {
    field: 'id',
    headerName: 'Customer ID',
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
  {
    field: 'domain',
    headerName: 'Domain',
    width: 230,
    sortable: false,
  },
];

interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  domain: string;
}

const mockData: MockCustomer[] = [
  {
    id: '1',
    name: 'Marko Petrović',
    phone: '+381641234567',
    email: 'marko.petrovic@example.com',
    domain: 'marko-company.com',
  },
  {
    id: '2',
    name: 'Jelena Stanković',
    phone: '+381621234567',
    email: 'jelena.stankovic@example.com',
    domain: 'stankovic-tech.rs',
  },
  {
    id: '3',
    name: 'Nikola Jovanović',
    phone: '+381601234567',
    email: 'nikola.jovanovic@example.com',
    domain: 'jovanovic-solutions.net',
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
          createButtonText="Create customer"
          rows={mockData}
          searchPlaceholder="Search cusomers"
          drawerContent={<CustomerDrawer />}
          onSearch={() => console.log('test')}
        />
      </Container>
    </>
  );
}
