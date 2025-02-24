import type { IChatParticipant } from 'src/types/chat';

import { useState, useEffect, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Divider,
  TextField,
  IconButton,
  Typography,
  Autocomplete,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetContacts, useGetConversation, useGetConversations } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';

import { Layout } from '../layout';
import { ChatRoom } from '../chat-room';
import { ChatNav, NAV_WIDTH } from '../chat-nav';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const { contacts } = useGetContacts();

  const searchParams = useSearchParams();

  const mdUp = useResponsive('up', 'md');

  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  const { conversations, conversationsLoading } = useGetConversations();

  const { conversation, conversationError, conversationLoading } = useGetConversation(
    `${selectedConversationId}`
  );

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants: IChatParticipant[] = conversation
    ? conversation.participants.filter(
        (participant: IChatParticipant) => participant.id !== `${user?.id}`
      )
    : [];

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.navigation.inbox);
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
    setRecipients(selected);
  }, []);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', p: 0 }}
    >
      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          globalheader: (
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                borderBottom: `solid 1px ${theme.vars.palette.divider}`,
                flexWrap: 'wrap',
              })}
            >
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: mdUp ? NAV_WIDTH : '890px',
                  px: 1,
                  borderRight: mdUp ? `solid 1px ${theme.vars.palette.divider}` : 'none',
                })}
              >
                <Typography variant="h4" sx={{ p: 1 }}>
                  Rotmark
                </Typography>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, p: 2, gap: 2 }}
              >
                <Autocomplete
                  // fullWidth
                  sx={{
                    flexGrow: 1,
                    // minWidth: '200px',
                  }}
                  options={['one', 'two']}
                  // getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search"
                      margin="none"
                      InputProps={{
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
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ),
          header: selectedConversationId ? (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={participants}
              loading={conversationLoading}
            />
          ) : (
            <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
          ),
          nav: (
            <ChatNav
              contacts={contacts}
              conversations={conversations}
              loading={conversationsLoading}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList
                  messages={conversation?.messages ?? []}
                  participants={participants}
                  loading={conversationLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-chat-active.svg`}
                  title="Good morning!"
                  description="Write something awesome..."
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
              />
            </>
          ),
          details: selectedConversationId && (
            <ChatRoom
              collapseNav={roomNav}
              participants={participants}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
