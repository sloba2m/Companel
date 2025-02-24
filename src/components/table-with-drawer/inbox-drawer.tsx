import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';

export const InboxDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create inbox</Typography>
    <Autocomplete
      options={['One ', 'two']}
      // getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Type" margin="none" size="small" />}
      // renderOption={(props, option) => (
      //   <li {...props} key={option.title}>
      //     {option.title}
      //   </li>
      // )}
    />
    <TextField label="Name" size="small" />
    <TextField label="Email" size="small" />
    <Autocomplete
      options={['One ', 'two']}
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
