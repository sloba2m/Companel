import type { IChatParticipant } from 'src/types/chat';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
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
  useTheme,
  TextField,
  IconButton,
  ListItemIcon,
  ListItemText,
  Autocomplete,
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
  const theme = useTheme();
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
      <IconButton>
        <SettingsIcon />
      </IconButton>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Contact information</Typography>
        {!isEdit && (
          <IconButton onClick={onEditTrue}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {isEdit ? (
        <>
          <TextField fullWidth label="Address" size="small" defaultValue={participant?.address} />
          <TextField
            size="small"
            fullWidth
            label="Phone number"
            defaultValue={participant?.phoneNumber}
            type="tel"
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            defaultValue={participant?.email}
            type="email"
          />
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
                    <ChatIcon sx={{ width: '16px', color: theme.vars.palette.grey[600] }} />
                  </ListItemIcon>
                  <ListItemText primary="Conversation 1" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ChatIcon sx={{ width: '16px', color: theme.vars.palette.grey[600] }} />
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
                    bgcolor: () => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
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
