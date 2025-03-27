import type { Contact } from 'src/types/contacts';
import type { IChatConversation } from 'src/types/chat';

import Drawer from '@mui/material/Drawer';
import { Stack, useTheme } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

const NAV_DRAWER_WIDTH = 320;
const NAV_WIDTH = 280;

type Props = {
  loading: boolean;
  contact?: Contact;
  collapseNav: UseNavCollapseReturn;
  messages: IChatConversation['messages'];
};

export function ChatRoom({ collapseNav, contact, messages, loading }: Props) {
  const theme = useTheme();

  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const renderContent = loading ? (
    <ChatRoomSkeleton />
  ) : (
    <Scrollbar>
      <div>
        <ChatRoomSingle contact={contact} />
      </div>
    </Scrollbar>
  );

  return (
    <>
      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', lg: 'flex' },
          borderLeft: `solid 1px ${theme.vars.palette.divider}`,
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.shorter,
          }),
          ...(collapseDesktop && { width: 0 }),
        }}
      >
        {!collapseDesktop && renderContent}
      </Stack>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_DRAWER_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
