import type { MockInbox } from 'src/pages/settings/inbox';

import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';

interface InboxDrawerProps {
  editData: MockInbox | null;
}

export const InboxDrawer = ({ editData }: InboxDrawerProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">{editData ? 'Edit' : 'Create'} inbox</Typography>

    {/* Autocomplete for Type */}
    <Autocomplete
      options={['One', 'Two']}
      // getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Type" margin="none" size="small" />}
      // renderOption={(props, option) => (
      //   <li {...props} key={option.title}>
      //     {option.title}
      //   </li>
      // )}
    />

    <TextField label="Name" size="small" defaultValue={editData?.name} />
    <TextField label="Email" size="small" />

    {/* Autocomplete for Template */}
    <Autocomplete
      options={['One', 'Two']}
      // getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField {...params} label="Template" margin="none" size="small" />
      )}
      // renderOption={(props, option) => (
      //   <li {...props} key={option.title}>
      //     {option.title}
      //   </li>
      // )}
    />

    <TextField label="Tenant ID" size="small" />
    <TextField label="Client ID" size="small" />
    <TextField label="Client secret" size="small" />

    <Button variant="soft" color="primary" size="small">
      Save
    </Button>
  </Box>
);
