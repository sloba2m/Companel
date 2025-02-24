import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps, NavItemBaseProps } from 'src/components/nav-section';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { varAlpha, hideScrollY } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { NavSectionMini, NavSectionVertical } from 'src/components/nav-section';

import { LanguagePopover } from '../components/language-popover';
import { NavToggleButton } from '../components/nav-toggle-button';
import { NotificationsDrawer } from '../components/notifications-drawer';

import type { LanguagePopoverProps } from '../components/language-popover';

// ----------------------------------------------------------------------

export type NavVerticalProps = NavSectionProps & {
  isNavMini: boolean;
  layoutQuery: Breakpoint;
  bottomData: {
    subheader?: string;
    items: NavItemBaseProps[];
  }[];
  onToggleNav?: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  langs?: LanguagePopoverProps['data'];
};

export function NavVertical({
  sx,
  data,
  bottomData,
  slots,
  isNavMini,
  layoutQuery,
  onToggleNav,
  langs,
  ...other
}: NavVerticalProps) {
  const theme = useTheme();

  const renderNavVertical = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          {/* <Logo /> */}
          <Iconify icon="mdi:alpha-c-box" width={48} />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />

        {slots?.bottomArea}
      </Scrollbar>
    </>
  );

  const renderNavMini = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <Logo />
          {/* <Iconify icon="mdi:alpha-c-box" width={48} /> */}
        </Box>
      )}

      <NavSectionMini
        data={data}
        sx={{ pb: 2, px: 0.5, ...hideScrollY, flex: '1 1 auto', overflowY: 'auto' }}
        {...other}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '8px' }}>
        <NotificationsDrawer data-slot="notifications" />
      </Box>

      <LanguagePopover data-slot="localization" data={langs} sx={{ margin: '0 auto 18px' }} />

      {bottomData && (
        <NavSectionMini
          data={bottomData}
          listSx={{ flexDirection: 'column-reverse' }}
          sx={{
            pb: 2,
            px: 0.5,
            ...hideScrollY,
            overflowY: 'auto',
          }}
          {...other}
        />
      )}
    </>
  );

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        transition: theme.transitions.create(['width'], {
          easing: 'var(--layout-transition-easing)',
          duration: 'var(--layout-transition-duration)',
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      {onToggleNav && (
        <NavToggleButton
          isNavMini={isNavMini}
          onClick={onToggleNav}
          sx={{
            display: 'none',
            [theme.breakpoints.up(layoutQuery)]: {
              display: 'inline-flex',
            },
          }}
        />
      )}
      {isNavMini ? renderNavMini : renderNavVertical}
    </Box>
  );
}
