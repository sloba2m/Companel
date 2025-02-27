import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

type Props = StackProps & {
  slots: {
    globalheader?: React.ReactNode;
    nav: React.ReactNode;
    details: React.ReactNode;
    header: React.ReactNode;
    main: React.ReactNode;
  };
};

export function Layout({ slots, sx, ...other }: Props) {
  const renderNav = (
    <Box display="flex" flexDirection="column">
      {slots.nav}
    </Box>
  );

  const renderHeader = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        py: 1.65,
        pr: 1,
        pl: 2.5,
        flexShrink: 0,
        borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      {slots.header}
    </Stack>
  );

  const renderMain = <Stack sx={{ flex: '1 1 auto', minWidth: 0 }}>{slots.main}</Stack>;

  const renderDetails = <Stack sx={{ minHeight: 0 }}>{slots.details}</Stack>;

  return (
    <Stack direction="column" sx={sx} {...other}>
      {slots.globalheader}
      <Stack direction="row" sx={{ overflow: 'auto', flexGrow: 1 }}>
        {renderNav}

        <Stack sx={{ flex: '1 1 auto', minWidth: 0 }}>
          {renderHeader}

          <Stack direction="row" sx={{ flex: '1 1 auto', minHeight: 0 }}>
            {renderMain}
            {renderDetails}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
