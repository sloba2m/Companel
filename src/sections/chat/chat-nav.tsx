import type { Conversation } from 'src/types/chat';
import type { ConversationData } from 'src/actions/chat';
import type {
  InfiniteData,
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';

import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

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
  Autocomplete,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useDebouncedCallback } from 'src/routes/hooks/use-debounce';

import { useResponsive } from 'src/hooks/use-responsive';

import { transform } from 'src/utils/htmlHelper';

import { useSearchInboxes } from 'src/actions/chat';
import { useInboxStore } from 'src/stores/inboxStore';
import { useGetWorkspaceData } from 'src/actions/account';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

import { ChannelFilters } from 'src/types/chat';

import { ChatNavItem } from './chat-nav-item';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { useChatNavScroll } from './hooks/use-chat-nav-scroll';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export const NAV_WIDTH = 420;
export const NAV_WIDTH_MOBILE = 320;

export enum StatusFilters {
  ALL = 'all',
  UNHANDLED = 'unhandled',
  MINE = 'mine',
  CLOSED = 'closed',
}

type Props = {
  loading: boolean;
  selectedConversationId: string;
  selectedInboxes: string[];
  collapseNav: UseNavCollapseReturn;
  conversations: Conversation[];
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<ConversationData, unknown>, Error>>;
  selectedFilter?: StatusFilters;
  selectedChannel?: ChannelFilters;
};

export function ChatNav({
  loading,
  selectedInboxes,
  collapseNav,
  selectedConversationId,
  conversations,
  selectedFilter,
  selectedChannel,
  fetchNextPage,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const location = useLocation();
  const searchParams = useSearchParams();
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslation();

  const { openMobile, onCloseMobile, onCloseDesktop } = collapseNav;

  const { isLoading } = useGetWorkspaceData();
  const { inboxes } = useInboxStore();

  const [inboxSearch, setInboxSearch] = useState('');

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleInboxChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('id');
    params.delete('conversationId');

    const newInboxes = selectedInboxes.includes(value)
      ? selectedInboxes.filter((item) => item !== value)
      : [...selectedInboxes, value];

    newInboxes.forEach((id) => {
      params.append('id', id);
    });

    router.push(`${paths.navigation.inboxBase}?${params.toString()}`);
  };

  const onFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('conversationId');
    params.set('status', value);
    router.push(`${paths.navigation.inboxBase}?${params.toString()}`);
  };

  const onChannelChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('conversationId');
    params.set('channel', value);
    router.push(`${paths.navigation.inboxBase}?${params.toString()}`);
  };

  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {conversations.map((conversation, i) => (
          <ChatNavItem
            key={conversation.id}
            conversation={conversation}
            selected={conversation.id === selectedConversationId}
            onCloseMobile={onCloseMobile}
            odd={i % 2 !== 0}
          />
        ))}
      </Box>
    </nav>
  );

  const [isOpen, setOpen] = useState<null | HTMLElement>(null);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const handleReachedTop = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);
  const { conversationsEndRef } = useChatNavScroll(conversations, handleReachedTop);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setInboxSearch(value);
  }, 300);

  const { data: inboxSearchData } = useSearchInboxes(inboxSearch);

  const searchOptions = useMemo(() => {
    if (!inboxSearchData) return [];

    return [
      ...inboxSearchData.messages.map((msg) => ({ ...msg, type: 'message' })),
      ...inboxSearchData.conversations.map((conv) => ({ ...conv, type: 'conversation' })),
    ];
  }, [inboxSearchData]);

  const handleNewConversationClick = () => {
    const params = new URLSearchParams(location.search);
    params.delete('conversationId');
    const newPath = `${location.pathname}?${params.toString()}`;

    router.push(newPath);
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
        <Autocomplete
          sx={{ flexGrow: 1 }}
          freeSolo
          disableClearable
          options={searchOptions}
          groupBy={(option) => option.type}
          renderGroup={(params) => (
            <li key={params.key}>
              <Typography
                variant="subtitle2"
                sx={{ px: 2, py: 1, backgroundColor: 'background.neutral' }}
              >
                {params.group === 'message' ? t('inbox.messages') : t('inbox.conversations')}
              </Typography>
              {params.children}
            </li>
          )}
          getOptionLabel={(option) =>
            typeof option === 'string'
              ? option
              : option.highlights?.[0]?.fragments?.[0]?.replace(/\n/g, ' ') || ''
          }
          onInputChange={(event, value) => {
            debouncedSearch(value);
          }}
          ListboxComponent={({ children, ...paperProps }) => (
            <Scrollbar {...paperProps}>{children}</Scrollbar>
          )}
          onChange={(e, value) => {
            if (typeof value === 'string' || !value) return;

            if ('message' in value) {
              // it's a SearchChat
              // console.log('Selected message:', value.message);
            } else if ('conversation' in value) {
              // it's a SearchInboxHighlight
              // console.log('Selected conversation:', value.conversation);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t('conversations.new.searchInboxes')}
              size="small"
              margin="none"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:baseline-search" width={24} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => {
            if (typeof option === 'string') return null;

            const isMessage = 'message' in option;
            const key = isMessage ? option.message.id : option.conversation.id;
            const highlight = option.highlights?.[0]?.fragments?.[0] ?? '';

            return (
              <MenuItem {...props} key={key}>
                <Typography variant="caption" sx={{ mr: 1 }}>
                  {isMessage ? `${option.message.sender.name}:` : ''}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {parse(highlight, { replace: transform })}
                </Box>
              </MenuItem>
            );
          }}
          loadingText={t('inbox.noResults')}
          loading
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleNewConversationClick()}>
            <Iconify icon="ic:baseline-add" width={24} />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexWrap: 'wrap-reverse' }}>
        <CustomTabs
          value={selectedFilter}
          onChange={(_e, value) => onFilterChange(value)}
          variant="fullWidth"
          sx={{ flexGrow: 1 }}
        >
          <Tab key="all" value={StatusFilters.ALL} label={t('conversations.menuLabels.all')} />
          <Tab
            key="unhandled"
            value={StatusFilters.UNHANDLED}
            label={t('conversations.menuLabels.unhandled')}
          />
          <Tab
            key="mine"
            value={StatusFilters.MINE}
            label={t('conversations.menuLabels.myConversations')}
          />
          <Tab
            key="closed"
            value={StatusFilters.CLOSED}
            label={t('conversations.menuLabels.closed')}
          />
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
          {!isLoading && (
            <>
              {inboxes.map((inbox) => (
                <MenuItem key={inbox.id} onClick={() => handleInboxChange(inbox.id)}>
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
        value={selectedChannel}
        onChange={(_e, value) => onChannelChange(value)}
        variant="fullWidth"
      >
        <Tab key={ChannelFilters.ALL} value={ChannelFilters.ALL} label="All" />
        <Tab
          key={ChannelFilters.WIDGET}
          value={ChannelFilters.WIDGET}
          icon={<Iconify width={24} icon="ic:round-widgets" />}
        />
        <Tab
          key={ChannelFilters.EMAIL}
          value={ChannelFilters.EMAIL}
          icon={<Iconify width={24} icon="logos:google-gmail" />}
        />
      </CustomTabs>
      <Divider />

      {loading ? (
        renderLoading
      ) : (
        <>
          {conversations.length > 0 ? (
            <Scrollbar sx={{ pb: 1 }} ref={conversationsEndRef}>
              {renderList}
            </Scrollbar>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Iconify icon="ic:outline-inbox" width={32} />
              <Typography>
                {selectedInboxes.length
                  ? t('conversations.new.empty')
                  : t('conversations.new.pleaseSelect')}
              </Typography>
            </Box>
          )}
        </>
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
