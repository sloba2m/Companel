import { useRef, useState, useEffect } from 'react';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { isExternalLink } from 'src/routes/utils';
import { useActiveLink } from 'src/routes/hooks/use-active-link';

import { bgBlur, varAlpha, stylesMode } from 'src/theme/styles';

import { NavItem } from './nav-item';
import { NavUl, NavLi } from '../styles';

import type { NavListProps, NavSubListProps } from '../types';

// ----------------------------------------------------------------------

export function NavList({
  data,
  depth,
  render,
  cssVars,
  slotProps,
  enabledRootRedirect,
  secondaryColor,
}: NavListProps) {
  const theme = useTheme();

  const navItemRef = useRef<HTMLButtonElement | null>(null);

  const active = useActiveLink(data.path, !!data.children);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (active && data.children) setOpenMenu(true);
    else setOpenMenu(false);
  }, [active, data.children]);

  const renderNavItem = (
    <NavItem
      ref={navItemRef}
      render={render}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      depth={depth}
      active={active}
      disabled={data.disabled}
      hasChild={!!data.children}
      open={data.children && openMenu}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      secondaryColor={secondaryColor}
    />
  );

  // Hidden item by role
  if (data.roles && slotProps?.currentRole) {
    if (!data?.roles?.includes(slotProps?.currentRole)) {
      return null;
    }
  }

  // Has children
  if (data.children) {
    return (
      <NavLi disabled={data.disabled}>
        {renderNavItem}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '87px',
            height: '100%',
            backgroundColor: theme.vars.palette.background.paper,
            color: 'red !important',
            width: openMenu ? '87px' : 0,
            pt: '80px',
            px: openMenu ? 0.5 : 0,
            borderRight: openMenu
              ? `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`
              : 'none',
            [stylesMode.dark]: {
              borderRight: `solid 1px ${varAlpha(theme.vars.palette.common.blackChannel, 0.12)}`,
              ...bgBlur({
                color: varAlpha(theme.vars.palette.background.paperChannel, 0.9),
                blur: 20,
              }),
            },
          }}
        >
          {openMenu && (
            <NavSubList
              data={data.children}
              depth={depth}
              render={render}
              cssVars={cssVars}
              slotProps={slotProps}
              enabledRootRedirect={enabledRootRedirect}
            />
          )}
        </Box>
      </NavLi>
    );
  }

  // Default
  return <NavLi disabled={data.disabled}>{renderNavItem}</NavLi>;
}

// ----------------------------------------------------------------------

function NavSubList({
  data,
  render,
  depth,
  slotProps,
  enabledRootRedirect,
  cssVars,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: 0.5 }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth}
          cssVars={cssVars}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
          secondaryColor
        />
      ))}
    </NavUl>
  );
}
