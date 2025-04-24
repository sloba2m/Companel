import type { Message } from 'src/types/chat';
import type { Contact } from 'src/types/contacts';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  message: Message;
  contact?: Contact | null;
};

export function useMessage({ message, contact, currentUserId }: Props) {
  const senderFullName = message.user?.fullName ?? message.contact?.name;

  const isUser = !!message.user;

  // const hasImage = message.contentType === 'image';

  return { hasImage: false, isUser, senderFullName };
}
