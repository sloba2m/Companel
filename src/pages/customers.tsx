import { Helmet } from 'react-helmet-async';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Stack,
  Button,
  Drawer,
  useTheme,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

const metadata = { title: `Customers` };

const columns: GridColDef[] = [
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
  const mdUp = useResponsive('up', 'md');
  const { value, onToggle } = useBoolean(false);
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ display: 'flex', flexGrow: 1, mb: 4 }}>
          <Stack
            direction="column"
            sx={{
              width: value && mdUp ? 'calc(100% - 300px)' : '100%',
              transition: theme.transitions.create(['width'], {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          >
            <Stack
              direction={mdUp ? 'row' : 'column'}
              sx={{ gap: 2, p: 2, justifyContent: 'space-between' }}
            >
              <TextField placeholder="Search customers" sx={{ width: mdUp ? '400px' : '100%' }} />
              <Button variant="soft" color="primary" onClick={onToggle}>
                Create customer
              </Button>
            </Stack>
            <DataGrid
              columns={columns}
              rows={mockData}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnResize
            />
          </Stack>
          {mdUp ? (
            <Box
              sx={{
                minHeight: 0,
                flex: '1 1 auto',
                width: '300px',
                display: { xs: 'none', lg: 'flex' },
                borderLeft: `solid 1px ${theme.vars.palette.divider}`,
                transition: theme.transitions.create(['width'], {
                  duration: theme.transitions.duration.shorter,
                }),
                ...(!value && { width: '0px' }),
              }}
            >
              {value && <CreateCustomer />}
            </Box>
          ) : (
            <Drawer
              anchor="right"
              open={value}
              onClose={onToggle}
              slotProps={{ backdrop: { invisible: true } }}
              PaperProps={{ sx: { width: '300px' } }}
            >
              <CreateCustomer />
            </Drawer>
          )}
        </Card>
      </Container>
    </>
  );
}

const CreateCustomer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create customer</Typography>
    <TextField label="Name" />
    <TextField label="Custom Customer ID" />
    <TextField label="Phone" />
    <TextField label="Email" />
    <TextField label="Domain" />
    <Button variant="soft" color="primary">
      Save
    </Button>
  </Box>
);
