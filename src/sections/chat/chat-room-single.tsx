import type { Contact } from 'src/types/contacts';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {
  Box,
  Chip,
  List,
  Button,
  ListItem,
  Collapse,
  useTheme,
  TextField,
  IconButton,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  ListItemButton,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';

// ----------------------------------------------------------------------

type Props = {
  contact?: Contact;
};

export function ChatRoomSingle({ contact }: Props) {
  const theme = useTheme();
  const collapseTag = useBoolean(true);
  const collapseConv = useBoolean(true);
  const { value: isEdit, onTrue: onEditTrue, onFalse: onEditFalse } = useBoolean(false);
  const initials = contact?.name
    .split(' ')
    .map((word) => word[0])
    .join('');

  const renderInfo = (
    <Stack alignItems="center" direction="row" justifyContent="center" sx={{ p: 3, gap: 2 }}>
      <Avatar alt={contact?.name} sx={{ width: 48, height: 48 }}>
        {initials}
      </Avatar>
      <Typography variant="subtitle1">{contact?.name}</Typography>
      <IconButton>
        <Iconify icon="ic:baseline-settings" />
      </IconButton>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Contact information</Typography>
        {!isEdit && (
          <IconButton onClick={onEditTrue}>
            <Iconify icon="ic:baseline-edit" fontSize="small" />
          </IconButton>
        )}
      </Box>
      {isEdit ? (
        <>
          <TextField fullWidth label="Address" size="small" defaultValue={contact?.email} />
          <TextField
            size="small"
            fullWidth
            label="Phone number"
            defaultValue={contact?.phoneNumber}
            type="tel"
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            defaultValue={contact?.email}
            type="email"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button size="small" onClick={onEditFalse}>
              Cancel
            </Button>
            <Button size="small" variant="soft" color="primary">
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <ListItemText primary="Address" secondary={contact?.email} />
          <ListItemText primary="Phone number" secondary={contact?.phoneNumber} />
          <ListItemText primary="Email" secondary={contact?.email} />
        </>
      )}
    </Stack>
  );

  return (
    <>
      {renderInfo}

      {renderContact}
      <CollapseButton selected={collapseTag.value} onClick={collapseTag.onToggle}>
        Tags
      </CollapseButton>

      <Collapse in={collapseTag.value}>
        <Autocomplete
          multiple
          options={['tag1', 'tag2']}
          defaultValue={['tag2']}
          freeSolo
          disableClearable
          sx={{ m: 2 }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip variant="outlined" size="small" label={option} key={key} {...tagProps} />
              );
            })
          }
          renderInput={(params) => <TextField {...params} placeholder="Add Tags" size="small" />}
        />
      </Collapse>

      <CollapseButton selected={collapseConv.value} onClick={collapseConv.onToggle}>
        Previous conversation
      </CollapseButton>

      <Collapse in={collapseConv.value}>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify
                      icon="ic:baseline-chat"
                      width={16}
                      sx={{ color: theme.vars.palette.grey[600] }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Conversation 1" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify
                      icon="ic:baseline-chat"
                      width={16}
                      sx={{ color: theme.vars.palette.grey[600] }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Conversation 2" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
      </Collapse>
    </>
  );
}
