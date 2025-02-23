import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';

export const InboxDrawer = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, gap: 2 }}>
    <Typography variant="subtitle1">Create inbox</Typography>
    <Autocomplete
      options={['One ', 'two']}
      // getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Type" margin="none" />}
      // renderOption={(props, option) => (
      //   <li {...props} key={option.title}>
      //     {option.title}
      //   </li>
      // )}
    />
    <TextField label="Name" />
    <TextField label="Email" />
    <Autocomplete
      options={['One ', 'two']}
      // getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Template" margin="none" />}
      // renderOption={(props, option) => (
      //   <li {...props} key={option.title}>
      //     {option.title}
      //   </li>
      // )}
    />
    <TextField label="Tenant ID" />
    <TextField label="Client ID" />
    <TextField label="Client secret" />
    <Button variant="soft" color="primary">
      Save
    </Button>
  </Box>
);
