import type { WorkspaceInbox } from 'src/actions/account';

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import { IconButton, Stack, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { useResponsive } from 'src/hooks/use-responsive';

import { useGetWorkspaceData } from 'src/actions/account';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onOpenMobile: () => void;
  values: {
    inbox?: WorkspaceInbox;
    to: string;
    cc: string;
    name: string;
    subject: string;
  };
  onChange: (field: keyof Props['values'], value: any) => void;
};

export function ChatHeaderCompose({ onOpenMobile, onChange, values }: Props) {
  const { t } = useTranslation();
  const mdDown = useResponsive('down', 'md');

  const { data: workspaceData } = useGetWorkspaceData();

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
      <Stack mt={0.7} gap={2} sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, flex: 0 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', my: 1.1, width: '40px' }}>
              {t('conversations.createForm.inbox')}:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, width: '100%', mr: 2 }}>
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={workspaceData?.inboxes ?? []}
              value={values.inbox}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, val) => onChange('inbox', val)}
              renderInput={(params) => (
                <TextField {...params} label="Inbox" margin="none" size="small" />
              )}
            />

          </Box>
        </Box>
        <Box display="flex" sx={{ flex: 1, width: '100%' }} gap={2}>
          <Box display="flex" sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, flex: 0 }}>
              {[
                t('conversations.createForm.to'),
                'Cc',
              ].map((label) => (
                <Typography key={label} variant="subtitle2" sx={{ color: 'text.primary', my: 1.1, width: '40px' }}>
                  {label}:
                </Typography>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, flex: 1 }}>

              <TextField
                placeholder={`+ ${t('conversations.new.recipients')}`}
                size="small"
                value={values.to}
                onChange={(e) => onChange('to', e.target.value)}
                sx={{ wdith: '100%', ml: 2 }}
              />
              <TextField
                placeholder={`+ ${t('conversations.new.recipients')}`}
                size="small"
                value={values.cc}
                onChange={(e) => onChange('cc', e.target.value)}
                sx={{ wdith: '100%', ml: 2 }}
              />

            </Box>
          </Box>
          <Box display="flex" sx={{ flex: 1 }} pr={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, flex: 0 }}>
              {[

                t('conversations.createForm.contactName'),
                t('conversations.createForm.subject'),
              ].map((label) => (
                <Typography key={label} variant="subtitle2" sx={{ color: 'text.primary', my: 1.1, width: '60px' }}>
                  {label}:
                </Typography>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2, flex: 1 }}>

              <TextField
                placeholder="Name"
                size="small"
                value={values.name}
                onChange={(e) => onChange('name', e.target.value)}
                sx={{ wdith: '100%' }}
              />
              <TextField
                size="small"
                placeholder="Add Subject"
                value={values.subject}
                onChange={(e) => onChange('subject', e.target.value)}
                sx={{ wdith: '100%' }}
              />
            </Box>
          </Box>

        </Box>

      </Stack >

    </>
  );
}
