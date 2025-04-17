import type { Conversation } from 'src/types/chat';

import { useEffect } from 'react';

import Drawer from '@mui/material/Drawer';

import { useGetTags } from 'src/actions/tags';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

const NAV_DRAWER_WIDTH = 320;

type Props = {
  loading: boolean;
  conversation?: Conversation;
  collapseNav: UseNavCollapseReturn;
};

export function ChatRoom({ collapseNav, conversation, loading }: Props) {
  const { openMobile, onCloseMobile, onCollapseDesktop } = collapseNav;

  useEffect(() => {
    if (conversation?.contact?.id) return;
    onCollapseDesktop();
    onCloseMobile();
  }, [conversation, onCollapseDesktop, onCloseMobile]);

  const { data } = useGetTags();

  const renderContent =
    loading || !conversation ? (
      <ChatRoomSkeleton />
    ) : (
      <Scrollbar>
        <div>
          <ChatRoomSingle key={conversation?.id} conversation={conversation} allTags={data ?? []} />
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
