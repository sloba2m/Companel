import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';

import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { InboxDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

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
  const tableDrawer = useTableDrawer<MockInbox>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const columns: GridColDef<MockInbox>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      ...firstColumnMargin,
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
        rows={mockInboxes}
        entity="Inbox"
        drawerContent={<InboxDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
        isInSubMenu
      />
    </>
  );
}
