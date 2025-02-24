import type { IChatParticipant } from 'src/types/chat';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import {
  Box,
  Chip,
  List,
  Paper,
  Button,
  ListItem,
  Collapse,
  TextField,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';
// ----------------------------------------------------------------------

type Props = {
  participant: IChatParticipant;
};

const TIMELINES = [
  {
    key: 1,
    title: 'Created',
    des: '09:30 am',
    time: '09:30 am',
    icon: <Iconify icon="eva:folder-add-fill" width={24} />,
  },
  {
    key: 2,
    title: 'Status updated',
    des: '10:00 am',
    time: '10:00 am',
    color: 'primary',
    icon: <Iconify icon="eva:image-2-fill" width={24} />,
  },
];

const lastItem = TIMELINES[TIMELINES.length - 1].key;

export function ChatRoomSingle({ participant }: Props) {
  const collapseTag = useBoolean(true);
  const collapseConv = useBoolean(true);
  const { value: isEdit, onTrue: onEditTrue, onFalse: onEditFalse } = useBoolean(false);
  const initials = participant?.name
    .split(' ')
    .map((word) => word[0])
    .join('');

  const renderInfo = (
    <Stack alignItems="center" direction="row" justifyContent="center" sx={{ p: 3, gap: 2 }}>
      <Avatar alt={participant?.name} sx={{ width: 48, height: 48 }}>
        {initials}
      </Avatar>
      <Typography variant="subtitle1">{participant?.name}</Typography>
    </Stack>
  );

  console.log(isEdit);
  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Contact information</Typography>
        {!isEdit && (
          <IconButton size="small" onClick={onEditTrue}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      {isEdit ? (
        <>
          <TextField fullWidth label="Address" defaultValue={participant?.address} />
          <TextField
            fullWidth
            label="Phone number"
            defaultValue={participant?.phoneNumber}
            type="tel"
          />
          <TextField fullWidth label="Email" defaultValue={participant?.email} type="email" />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button size="small" onClick={onEditFalse}>
              Cancel
            </Button>
            <Button size="small" variant="soft" color="success">
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <ListItemText primary="Address" secondary={participant?.address} />
          <ListItemText primary="Phone number" secondary={participant?.phoneNumber} />
          <ListItemText primary="Email" secondary={participant?.email} />
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

      <Collapse in={collapseConv.value}>
        <Timeline
          position="right"
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {TIMELINES.map((item) => (
            <TimelineItem key={item.key}>
              <TimelineSeparator>
                <TimelineDot />
                {lastItem === item.key ? null : <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
                  }}
                >
                  <Typography variant="subtitle2">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.des}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Collapse>
    </>
  );
}
