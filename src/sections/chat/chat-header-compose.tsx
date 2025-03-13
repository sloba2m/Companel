import type { IChatParticipant } from 'src/types/chat';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { useResponsive } from 'src/hooks/use-responsive';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  contacts: IChatParticipant[];
  onAddRecipients: (selected: IChatParticipant[]) => void;
  onOpenMobile: () => void;
};

export function ChatHeaderCompose({ contacts, onAddRecipients, onOpenMobile }: Props) {
  const [searchRecipients, setSearchRecipients] = useState('');
  const mdDown = useResponsive('down', 'md');

  const handleAddRecipients = useCallback(
    (selected: IChatParticipant[]) => {
      setSearchRecipients('');
      onAddRecipients(selected);
    },
    [onAddRecipients]
  );

  const recipientRender = (
    <Autocomplete
      sx={{ minWidth: mdDown ? 240 : 400, flexGrow: { xs: 1, md: 'unset' } }}
      multiple
      limitTags={3}
      popupIcon={null}
      defaultValue={[]}
      disableCloseOnSelect
      noOptionsText={<SearchNotFound query={searchRecipients} />}
      onChange={(event, newValue) => handleAddRecipients(newValue)}
      onInputChange={(event, newValue) => setSearchRecipients(newValue)}
      options={contacts}
      getOptionLabel={(recipient) => recipient.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} placeholder="+ Recipients" size="small" />}
      renderOption={(props, recipient, { selected }) => (
        <li {...props} key={recipient.id}>
          <Box
            key={recipient.id}
            sx={{
              mr: 1,
              width: 32,
              height: 32,
              overflow: 'hidden',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            <Avatar alt={recipient.name} src={recipient.avatarUrl} sx={{ width: 1, height: 1 }} />
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                opacity: 0,
                position: 'absolute',
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.8),
                transition: (theme) =>
                  theme.transitions.create(['opacity'], {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(selected && { opacity: 1, color: 'primary.main' }),
              }}
            >
              <Iconify icon="eva:checkmark-fill" />
            </Stack>
          </Box>

          {recipient.name}
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((recipient, index) => (
          <Chip
            {...getTagProps({ index })}
            key={recipient.id}
            label={recipient.name}
            avatar={<Avatar alt={recipient.name} src={recipient.avatarUrl} />}
            size="small"
            variant="soft"
          />
        ))
      }
    />
  );

  return (
    <>
      {mdDown && (
        <IconButton
          onClick={onOpenMobile}
          sx={(theme) => ({
            mr: 2,
            backgroundColor: theme.vars.palette.primary.main,
            color: theme.vars.palette.primary.contrastText,
            '&:hover': { backgroundColor: theme.vars.palette.primary.darker },
          })}
        >
          <Iconify width={16} icon="solar:users-group-rounded-bold" />
        </IconButton>
      )}
      <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 0.7 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.primary', my: 1.1 }}>
            To:
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.primary', my: 1.1 }}>
            Cc:
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.primary', my: 1.1 }}>
            Subject:
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2 }}>
          {recipientRender}
          {recipientRender}
          <TextField size="small" placeholder="Add Subject" />
        </Box>
      </Box>
    </>
  );
}
