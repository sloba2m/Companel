import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ width = 40, height = 40, disableLink = false, className, href = '/', sx, ...other }, ref) => {
    /*
     * OR using local (public folder)
     * const logo = ( <Box alt="logo" component="img" src={`${CONFIG.site.basePath}/logo/logo-single.svg`} width={width} height={height} /> );
     */

    const logo = (
      <svg
        width="24"
        height="31"
        viewBox="0 0 24 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="21.438"
          height="21.438"
          rx="3.29815"
          transform="matrix(-0.970296 -0.241922 0 1 20.8008 8.48438)"
          fill="white"
        />
        <rect
          width="21.438"
          height="21.438"
          rx="3.29815"
          transform="matrix(-0.970296 -0.241922 0 1 24 5.98438)"
          fill="white"
        />
        <rect
          width="16.4907"
          height="16.4907"
          rx="3.29815"
          transform="matrix(-0.970296 -0.241922 0 1 18.7305 10.0303)"
          fill="#3B82F6"
        />
        <path d="M20.0434 28.5752L23.0117 26.2665L20.2083 24.9473L20.0434 28.5752Z" fill="white" />
        <path d="M1.16015 4.33452L4.21094 1.94336L4.04603 4.49943L1.16015 4.33452Z" fill="white" />
        <path
          d="M0.00684166 24.4826V26.6049C0.00684166 27.1164 0.257803 27.5954 0.678377 27.8866C0.939075 28.0671 1.24861 28.1638 1.56569 28.1638H1.90693C2.23115 28.1638 2.5522 28.1 2.85183 27.9762L4.31865 27.3699C6.14286 26.6159 6.39248 24.134 4.75497 23.0318L3.86166 22.4305C2.21856 21.3246 0.00684166 22.502 0.00684166 24.4826Z"
          fill="white"
        />
        <path d="M0.00653791 25.2779V19.8359L3.30469 23.299L0.00653791 25.2779Z" fill="white" />
        <path d="M9.32198 26.6792L2.47834 28.0809L5.52994 24.2899L9.32198 26.6792Z" fill="white" />
        <path
          d="M3.88077 14.0174C3.88077 15.7317 4.58443 17.5513 5.83693 19.0758C7.08944 20.6003 8.78821 21.7049 10.5595 22.1465C12.3308 22.5882 14.0296 22.3307 15.2821 21.4308C16.5346 20.5308 17.2383 19.0621 17.2383 17.3478L14.1466 16.5769C14.1466 17.4977 13.7687 18.2865 13.096 18.7698C12.4233 19.2532 11.5109 19.3915 10.5595 19.1543C9.60818 18.9171 8.69579 18.3238 8.02308 17.505C7.35038 16.6862 6.97246 15.709 6.97246 14.7882L3.88077 14.0174Z"
          fill="white"
        />
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{ flexShrink: 0, display: 'inline-flex', verticalAlign: 'middle', ...sx }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            justifyContent: 'center',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
