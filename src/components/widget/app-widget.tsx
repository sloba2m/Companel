import type { BoxProps } from '@mui/material/Box';
// import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/config-global';

// import { useChart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  icon: string;
  flipIcon?: boolean;
  title: string;
  total?: number | string;
};

export function AppWidget({ title, total, icon, sx, flipIcon, ...other }: Props) {
  return (
    <Box
      sx={{
        p: 3,
        gap: 3,
        borderRadius: 2,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        color: 'common.white',
        bgcolor: 'primary.dark',
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SvgColor
          src={`${CONFIG.site.basePath}/assets/background/shape-circle-3.svg`}
          sx={{
            width: 200,
            height: 200,
            opacity: 0.08,
            position: 'absolute',
            color: 'primary.light',
          }}
        />
      </Box>

      <div>
        <Box sx={{ typography: 'h4' }}>{total}</Box>
        <Box sx={{ typography: 'subtitle2', opacity: 0.64 }}>{title}</Box>
      </div>

      <Iconify
        icon={icon}
        sx={{
          width: 120,
          right: -40,
          height: 120,
          opacity: 0.08,
          position: 'absolute',
          transform: flipIcon ? 'scaleX(-1)' : '',
        }}
      />
    </Box>
  );
}
