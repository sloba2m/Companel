import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';

import { SettingsButton } from 'src/layouts/components/settings-button';
import { LanguagePopover } from 'src/layouts/components/language-popover';
import { NotificationsDrawer } from 'src/layouts/components/notifications-drawer';

import { NavList } from './nav-list';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';
import { NavUl, NavLi, Subheader } from '../styles';

import type { NavGroupProps, NavSectionProps } from '../types';

// ----------------------------------------------------------------------

export function NavSectionVertical({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
  langs,
}: NavSectionProps) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.vertical(theme),
    ...overridesVars,
  };

  return (
    <Stack component="nav" className={navSectionClasses.vertical.root} sx={{ ...cssVars, ...sx }}>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            subheader={group.subheader}
            items={group.items}
            render={render}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
      <Stack direction="row-reverse" sx={{ mb: 2 }}>
        <SettingsButton data-slot="settings" />
        <LanguagePopover data-slot="localization" data={langs} />
        <NotificationsDrawer data-slot="notifications" />
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, subheader, slotProps, enabledRootRedirect }: NavGroupProps) {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderContent = (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );

  return (
    <NavLi>
      {subheader ? (
        <>
          <Subheader
            data-title={subheader}
            open={open}
            onClick={handleToggle}
            sx={slotProps?.subheader}
          >
            {subheader}
          </Subheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </NavLi>
  );
}
