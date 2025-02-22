import type { IChatParticipant, IChatConversations } from 'src/types/chat';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ChatNavItem } from './chat-nav-item';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ToggleButton as ThemeToggleButton } from './styles';
import { ChatNavSearchResults } from './chat-nav-search-results';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

const NAV_WIDTH = 420;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  selectedConversationId: string;
  contacts: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  conversations: IChatConversations;
};

export function ChatNav({
  loading,
  contacts,
  conversations,
  collapseNav,
  selectedConversationId,
}: Props) {
  const theme = useTheme();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { openMobile, onOpenMobile, onCloseMobile, onCloseDesktop } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: IChatParticipant[];
  }>({ query: '', results: [] });

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (!mdUp) onCloseMobile();
  }, [mdUp, onCloseMobile]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.navigation.two);
  }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(inputValue)
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    (result: IChatParticipant) => {
      handleClickAwaySearch();

      router.push(`${paths.navigation.two}?id=${result.id}`);
    },
    [handleClickAwaySearch, router]
  );

  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {conversations.allIds.map((conversationId) => (
          <ChatNavItem
            key={conversationId}
            conversation={conversations.byId[conversationId]}
            selected={conversationId === selectedConversationId}
            onCloseMobile={onCloseMobile}
          />
        ))}
      </Box>
    </nav>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const [selectedSocial, setSelectedSocial] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const renderContent = (
    <>
      <ToggleButtonGroup
        exclusive
        value={selectedFilter}
        onChange={(_e, value) => setSelectedFilter(value)}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="unhandled">Unhandled</ToggleButton>
        <ToggleButton value="mine">Mine</ToggleButton>
        <ToggleButton value="closed">Closed</ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        exclusive
        value={selectedSocial}
        onChange={(_e, value) => setSelectedSocial(value)}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="facebook">
          <Iconify width={24} icon="logos:facebook" />
        </ToggleButton>
        <ToggleButton value="gmail">
          <Iconify width={24} icon="logos:google-gmail" />
        </ToggleButton>
        <ToggleButton value="whatsapp">
          <Iconify width={24} icon="logos:whatsapp-icon" />
        </ToggleButton>
        <ToggleButton value="telegram">
          <Iconify width={24} icon="logos:telegram" />
        </ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {searchContacts.query && !!conversations.allIds.length ? renderListResults : renderList}
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ThemeToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ThemeToggleButton>

      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', md: 'flex' },
          borderRight: `solid 1px ${theme.vars.palette.divider}`,
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
