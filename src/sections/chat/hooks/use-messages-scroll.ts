import type { Message } from 'src/types/chat';

import { useRef, useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseMessagesScrollReturn = {
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

export function useMessagesScroll(
  messages: Message[],
  onReachedTop: () => void
): UseMessagesScrollReturn {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [nMessages, setNMessages] = useState(0);
  const [topPosition, setTopPosition] = useState(0);

  const scrollToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = messagesEndRef.current;
    if (!el) return;

    if (el.scrollTop === 0 && onReachedTop) {
      setTopPosition(el.scrollHeight);
      onReachedTop();
    }
  }, [onReachedTop]);

  useEffect(() => {
    const el = messagesEndRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    // eslint-disable-next-line consistent-return
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, messages]);

  useEffect(
    () => {
      if (!scrolledToBottom && !!messages.length) {
        scrollToBottom();
        setScrolledToBottom(true);
      }
      if (
        messages.length > 0 &&
        nMessages > 0 &&
        messages.length > nMessages &&
        messagesEndRef.current
      ) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight - topPosition;
      }
      if (messages.length > nMessages) setNMessages(messages.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages]
  );

  return { messagesEndRef };
}
