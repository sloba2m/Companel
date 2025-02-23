import type { GridColDef } from '@mui/x-data-grid';

import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { CONFIG } from 'src/config-global';

import { TableWithDrawer, TemplatesDrawer } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `templates settings - ${CONFIG.site.name}` };

interface MockTemplates {
  id: string;
  name: string;
  template: string;
  logo: string;
}

const columns: GridColDef<MockTemplates>[] = [
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
    field: 'logo',
    headerName: 'Logo',
    width: 160,
    sortable: false,
  },
];

const mockTemplates: MockTemplates[] = [
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
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableWithDrawer
          columns={columns}
          createButtonText="Create user"
          rows={mockTemplates}
          searchPlaceholder="Search contact"
          drawerContent={<TemplatesDrawer />}
        />
      </Container>
    </>
  );
}
