import type { IChatParticipant } from 'src/types/chat';

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
  TextField,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';

// ----------------------------------------------------------------------

type Props = {
  participant: IChatParticipant;
};

export function ChatRoomSingle({ participant }: Props) {
  const collapseTag = useBoolean(true);
  const collapseConv = useBoolean(true);

  const renderInfo = (
    <Stack alignItems="center" direction="row" justifyContent="center" sx={{ p: 3, gap: 2 }}>
      <Avatar alt={participant?.name} src={participant?.avatarUrl} sx={{ width: 48, height: 48 }} />
      <Typography variant="subtitle1">{participant?.name}</Typography>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      <Typography>Contact information</Typography>
      <TextField fullWidth label="Address" defaultValue={participant?.address} />
      <TextField
        fullWidth
        label="Phone number"
        defaultValue={participant?.phoneNumber}
        type="tel"
      />
      <TextField fullWidth label="Email" defaultValue={participant?.email} type="email" />
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
        <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              variant="soft"
              label="tag 1"
              size="small"
              onDelete={() => console.log('delete')}
            />
            <Chip
              variant="soft"
              label="tag 2"
              size="small"
              onDelete={() => console.log('delete')}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField fullWidth label="New tag" size="small" />
            <Button variant="soft">Add</Button>
          </Box>
        </Stack>
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
                    <Iconify icon="mdi:message-arrow-left-outline" width={16} />
                  </ListItemIcon>
                  <ListItemText primary="Conversation 1" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="mdi:message-arrow-left-outline" width={16} />
                  </ListItemIcon>
                  <ListItemText primary="Conversation 2" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
      </Collapse>

      <CollapseButton selected={collapseConv.value} onClick={collapseConv.onToggle}>
        Event history
      </CollapseButton>

      <Collapse in={collapseConv.value} />
    </>
  );
}
