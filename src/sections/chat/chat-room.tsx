import type { IChatParticipant, IChatConversation } from 'src/types/chat';

import Drawer from '@mui/material/Drawer';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomGroup } from './chat-room-group';
import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

const NAV_DRAWER_WIDTH = 320;

type Props = {
  loading: boolean;
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  messages: IChatConversation['messages'];
};

export function ChatRoom({ collapseNav, participants, messages, loading }: Props) {
  const { openMobile, onCloseMobile } = collapseNav;

  const group = participants.length > 1;

  const renderContent = loading ? (
    <ChatRoomSkeleton />
  ) : (
    <Scrollbar>
      <div>
        {group ? (
          <ChatRoomGroup participants={participants} />
        ) : (
          <ChatRoomSingle participant={participants[0]} />
        )}
      </div>
    </Scrollbar>
  );

  return (
    <Drawer
      anchor="right"
      open={openMobile}
      onClose={onCloseMobile}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: NAV_DRAWER_WIDTH } }}
    >
      {renderContent}
    </Drawer>
  );
}
