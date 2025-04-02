import type { WorkspaceInbox } from 'src/actions/account';

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
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
      <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 0.7 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2 }}>
          {[
            t('conversations.createForm.inbox'),
            t('conversations.createForm.to'),
            'Cc',
            t('conversations.createForm.contactName'),
            t('conversations.createForm.subject'),
          ].map((label) => (
            <Typography key={label} variant="subtitle2" sx={{ color: 'text.primary', my: 1.1 }}>
              {label}:
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 2 }}>
          <Autocomplete
            fullWidth
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
          <TextField
            placeholder={`+ ${t('conversations.new.recipients')}`}
            size="small"
            value={values.to}
            onChange={(e) => onChange('to', e.target.value)}
            sx={{ minWidth: mdDown ? 240 : 400, flexGrow: { xs: 1, md: 'unset' } }}
          />
          <TextField
            placeholder={`+ ${t('conversations.new.recipients')}`}
            size="small"
            value={values.cc}
            onChange={(e) => onChange('cc', e.target.value)}
            sx={{ minWidth: mdDown ? 240 : 400, flexGrow: { xs: 1, md: 'unset' } }}
          />
          <TextField
            placeholder="Name"
            size="small"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            sx={{ minWidth: mdDown ? 240 : 400, flexGrow: { xs: 1, md: 'unset' } }}
          />
          <TextField
            size="small"
            placeholder="Add Subject"
            value={values.subject}
            onChange={(e) => onChange('subject', e.target.value)}
          />
        </Box>
      </Box>
    </>
  );
}
