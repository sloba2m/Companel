import type { GridColDef } from '@mui/x-data-grid';

import { Helmet } from 'react-helmet-async';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { ContactDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

// ----------------------------------------------------------------------

const metadata = { title: `Contacts` };

export interface MockContact {
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
  const tableDrawer = useTableDrawer<MockContact>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

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
        entity="Contacts"
        rows={mockContacts}
        drawerContent={<ContactDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
      />
    </>
  );
}
