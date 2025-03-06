import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';

import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import {
  TableWithDrawer,
  TemplatesDrawer,
  firstColumnMargin,
} from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Templates settings - ${CONFIG.site.name}` };

export interface MockTemplate {
  id: string;
  name: string;
  template: string;
  logo: string;
}

const mockTemplates: MockTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    template: "Welcome to our platform! We're excited to have you on board.",
    logo: 'https://example.com/logos/welcome.png',
  },
  {
    id: '2',
    name: 'Newsletter',
    template: 'Stay updated with our latest news and special offers!',
    logo: 'https://example.com/logos/newsletter.png',
  },
  {
    id: '3',
    name: 'Password Reset',
    template: 'Click the link below to reset your password securely.',
    logo: 'https://example.com/logos/password-reset.png',
  },
];

export default function Page() {
  const tableDrawer = useTableDrawer<MockTemplate>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const columns: GridColDef<MockTemplate>[] = [
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
      field: 'logo',
      headerName: 'Logo',
      width: 160,
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
        entity="Templates"
        columns={columns}
        rows={mockTemplates}
        drawerContent={<TemplatesDrawer editData={editData} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
      />
    </>
  );
}
