import type { IChatParticipant, IChatConversations } from 'src/types/chat';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Menu,
  Divider,
  MenuItem,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useGetWorkspaceData } from 'src/actions/account';

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

  const { data: workspaceData, isLoading } = useGetWorkspaceData();

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

  const [selectedInboxes, setSelectedInboxes] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    setSelectedInboxes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const renderContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          gap: 1,
        }}
      >
        <TextField
          placeholder="Search Inboxes"
          margin="none"
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:baseline-search" width={24} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton>
            <Iconify icon="ic:baseline-add" width={24} />
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
            <Iconify icon="ic:baseline-filter-list" width={24} />
          </IconButton>
        </Box>
        <Menu id="simple-menu" anchorEl={isOpen} onClose={handleClose} open={!!isOpen}>
          <Typography variant="body1" fontWeight="fontWeightBold" sx={{ ml: 1, mb: 0.5 }}>
            Inbox selector
          </Typography>
          {!isLoading && workspaceData && (
            <>
              <MenuItem key={workspaceData.name} onClick={() => handleToggle(workspaceData.name)}>
                <Checkbox checked={selectedInboxes.includes(workspaceData.name)} />
                {workspaceData?.name}
              </MenuItem>
              {workspaceData?.inboxes.map((inbox) => (
                <MenuItem key={inbox.id} onClick={() => handleToggle(inbox.id)}>
                  <Checkbox checked={selectedInboxes.includes(inbox.id)} />
                  {inbox.name}
                </MenuItem>
              ))}
            </>
          )}
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
