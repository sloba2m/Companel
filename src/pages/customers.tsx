import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { CustomerDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

// ----------------------------------------------------------------------

const metadata = { title: `Customers` };

export interface MockCustomer {
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
  const [editData, setEditData] = useState<MockCustomer | null>(null);
  const drawerState = useBoolean(false);
  const { onToggle: onToggleDrawer } = drawerState;

  const handleEdit = (customer: MockCustomer) => {
    onToggleDrawer();
    setEditData(customer);
  };

  const handleDelete = (customer: MockCustomer) => {
    console.log('Delete:', customer);
  };

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
      flex: 1,
    },
    {
      field: 'domain',
      headerName: 'Domain',
      width: 230,
      sortable: false,
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
        rows={mockData}
        entity="Customers"
        drawerContent={<CustomerDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        drawerState={drawerState}
      />
    </>
  );
}
