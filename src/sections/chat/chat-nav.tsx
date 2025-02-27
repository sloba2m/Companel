import type { IChatParticipant, IChatConversations } from 'src/types/chat';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Tab,
  Menu,
  Divider,
  MenuItem,
  TextField,
  IconButton,
  Autocomplete,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

import { ChatNavItem } from './chat-nav-item';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export const NAV_WIDTH = 420;
export const NAV_WIDTH_MOBILE = 320;

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

  const { openMobile, onCloseMobile, onCloseDesktop } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: IChatParticipant[];
  }>({ query: '', results: [] });

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  // const handleSearchContacts = useCallback(
  //   (inputValue: string) => {
  //     setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

  //     if (inputValue) {
  //       const results = contacts.filter((contact) =>
  //         contact.name.toLowerCase().includes(inputValue)
  //       );

  //       setSearchContacts((prevState) => ({ ...prevState, results }));
  //     }
  //   },
  //   [contacts]
  // );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    (result: IChatParticipant) => {
      handleClickAwaySearch();

      router.push(`${paths.navigation.inbox}?id=${result.id}`);
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

  const [selectedSocial, setSelectedSocial] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isOpen, setOpen] = useState<null | HTMLElement>(null);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const renderContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          // width: mdUp ? NAV_WIDTH : '890px',
          p: 1,
          gap: 1,
          // borderRight: mdUp ? `solid 1px ${theme.vars.palette.divider}` : 'none',
        }}
      >
        <Autocomplete
          // fullWidth
          sx={{
            flexGrow: 1,
            // minWidth: '200px',
          }}
          options={['Rotmark', 'Demo Account', 'Widget']}
          // getOptionLabel={(option) => option.title}
          value="Rotmark"
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Inboxes"
              margin="none"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
          // renderOption={(props, option) => (
          //   <li {...props} key={option.title}>
          //     {option.title}
          //   </li>
          // )}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton>
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexWrap: 'wrap-reverse' }}>
        <CustomTabs
          value={selectedFilter}
          onChange={(_e, value) => setSelectedFilter(value)}
          variant="fullWidth"
          sx={{ flexGrow: 1 }}
        >
          <Tab key="all" value="all" label="All" />
          <Tab key="unhandled" value="unhandled" label="Unhandled" />
          <Tab key="mine" value="mine" label="Mine" />
          <Tab key="closed" value="closed" label="Closed" />
        </CustomTabs>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--palette-background-neutral)',
            width: mdUp ? 'auto' : '100%',
          }}
        >
          <IconButton onClick={handleOpen}>
            <FilterListIcon />
          </IconButton>
        </Box>
        <Menu id="simple-menu" anchorEl={isOpen} onClose={handleClose} open={!!isOpen}>
          {['Tag 1', 'Tag 2', 'Tag 3'].map((option) => (
            <MenuItem key={option} selected={option === 'Profile'} onClick={handleClose}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Divider />

      <CustomTabs
        value={selectedSocial}
        onChange={(_e, value) => setSelectedSocial(value)}
        variant="fullWidth"
      >
        <Tab key="all" value="all" label="All" />
        <Tab key="facebook" value="facebook" icon={<Iconify width={24} icon="logos:facebook" />} />
        <Tab key="gmail" value="gmail" icon={<Iconify width={24} icon="logos:google-gmail" />} />
        <Tab
          key="whatsapp"
          value="whatsapp"
          icon={<Iconify width={24} icon="logos:whatsapp-icon" />}
        />
        <Tab key="telegram" value="telegram" icon={<Iconify width={24} icon="logos:telegram" />} />
      </CustomTabs>
      <Divider />

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
        PaperProps={{ sx: { width: NAV_WIDTH_MOBILE } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
