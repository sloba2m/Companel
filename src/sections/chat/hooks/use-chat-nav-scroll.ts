import type { Conversation } from 'src/types/chat';

import { useRef, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseMessagesScrollReturn = {
  conversationsEndRef: React.RefObject<HTMLDivElement>;
};

export function useChatNavScroll(
  conversations: Conversation[],
  onReachedTop: () => void
): UseMessagesScrollReturn {
  const conversationsEndRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = conversationsEndRef.current;
    if (!el) return;

    if (el.scrollTop + el.clientHeight === el.scrollHeight && onReachedTop) {
      onReachedTop();
    }
  }, [onReachedTop]);

  useEffect(() => {
    const el = conversationsEndRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    // eslint-disable-next-line consistent-return
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, conversations]);

  return { conversationsEndRef };
}
