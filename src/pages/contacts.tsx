import type { GridColDef } from '@mui/x-data-grid';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useBoolean } from 'src/hooks/use-boolean';

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
  const [editData, setEditData] = useState<MockContact | null>(null);
  const drawerState = useBoolean(false);
  const { onToggle: onToggleDrawer } = drawerState;

  const handleEdit = (contact: MockContact) => {
    onToggleDrawer();
    setEditData(contact);
  };

  const handleDelete = (contact: MockContact) => {
    console.log('Delete:', contact);
  };

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
        drawerState={drawerState}
      />
    </>
  );
}
