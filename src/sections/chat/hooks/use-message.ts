import type { Message } from 'src/types/chat';
import type { Contact } from 'src/types/contacts';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  message: Message;
  contact?: Contact;
};

export function useMessage({ message, contact, currentUserId }: Props) {
  const senderDetails =
    message.user?.id === currentUserId ? { type: 'me' } : { fullName: contact?.name };

  const me = senderDetails.type === 'me';

  // const hasImage = message.contentType === 'image';

  return { hasImage: false, me, senderDetails };
}
