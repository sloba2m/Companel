import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { InboxDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

// ----------------------------------------------------------------------

const metadata = { title: `Inbox settings - ${CONFIG.site.name}` };

export interface MockInbox {
  id: string;
  name: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

const mockInboxes: MockInbox[] = [
  {
    id: '1',
    name: 'Support Inbox',
    template: 'Customer Support Template',
    createdAt: '20 Feb 2024',
    updatedAt: '21 Feb 2024',
  },
  {
    id: '2',
    name: 'Sales Inbox',
    template: 'Sales Outreach Template',
    createdAt: '18 Feb 2024',
    updatedAt: '22 Feb 2024',
  },
  {
    id: '3',
    name: 'Marketing Inbox',
    template: 'Newsletter Campaign Template',
    createdAt: '15 Feb 2024',
    updatedAt: '23 Feb 2024',
  },
];

export default function Page() {
  const [editData, setEditData] = useState<MockInbox | null>(null);
  const drawerState = useBoolean(false);
  const { onToggle: onToggleDrawer } = drawerState;

  const handleEdit = (inbox: MockInbox) => {
    onToggleDrawer();
    setEditData(inbox);
  };

  const handleDelete = (inbox: MockInbox) => {
    console.log('Delete:', inbox);
  };

  const columns: GridColDef<MockInbox>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
    },
    {
      field: 'template',
      headerName: 'Template',
      width: 230,
      sortable: false,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 230,
      sortable: false,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
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
        createButtonText="Create inbox"
        rows={mockInboxes}
        searchPlaceholder="Search inbox"
        drawerContent={<InboxDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        drawerState={drawerState}
      />
    </>
  );
}
