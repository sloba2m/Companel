import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getStorage } from 'src/hooks/use-local-storage';

import { useInboxStore } from 'src/stores/inboxStore';
import { useGetWorkspaceData } from 'src/actions/account';

import { LoadingScreen } from 'src/components/loading-screen';

import { ChatView } from 'src/sections/chat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Inbox` };

export interface LocalStorageFilters {
  id?: string[] | null;
  status?: string | null;
  channel?: string | null;
  conversationId?: string | null;
}

const getInboxPath = (inboxFilters: LocalStorageFilters): string => {
  if (!inboxFilters) {
    return paths.navigation.inbox;
  }
  const isEmpty = Object.values(inboxFilters).every(
    (value) => value === null || value === '' || (Array.isArray(value) && value.length === 0)
  );

  if (isEmpty) {
    return paths.navigation.inbox;
  }

  const queryParams: [string, string][] = [];

  Object.entries(inboxFilters).forEach(([key, value]) => {
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;

    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.push([key, v]));
    } else {
      queryParams.push([key, value]);
    }
  });

  const queryString = new URLSearchParams(queryParams).toString();
  return `${paths.navigation.inboxBase}?${queryString}`;
};

export default function Page() {
  const router = useRouter();
  const storage = getStorage('inboxQuery') as LocalStorageFilters;
  const [redirected, setRedirected] = useState(false);

  useGetWorkspaceData();
  const { inboxes } = useInboxStore();

  useEffect(() => {
    const firstInboxId = inboxes?.[0]?.id;

    const newStorage: LocalStorageFilters = {
      id: storage?.id?.length ? storage.id : firstInboxId ? [firstInboxId] : [],
      status: storage?.status ?? 'mine',
      channel: storage?.channel ?? 'all',
      conversationId: storage?.conversationId ?? null,
    };

    router.push(getInboxPath(newStorage));
    setRedirected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!redirected) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <ChatView />
    </>
  );
}
