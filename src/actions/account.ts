import type { User } from 'src/types/users';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetcher } from 'src/utils/axios';

import { useInboxStore } from 'src/stores/inboxStore';

interface Category {
  type: 'ALL' | 'MINE' | 'UNASSIGNED' | 'RESOLVED';
  number: number;
}

export interface WorkspaceInbox {
  id: string;
  name: string;
  channelType: 'EMAIL' | 'WIDGET';
  categories: Category[];
}

interface WorkspaceData {
  name: string;
  inboxes: WorkspaceInbox[];
  categories: Category[];
}

export const useGetWorkspaceData = () => {
  const { setInboxes } = useInboxStore();

  const res = useQuery<WorkspaceData>({
    queryKey: ['account-workspace'],
    queryFn: () => fetcher('/account/workspace'),
  });

  useEffect(() => {
    setInboxes(res.data?.inboxes || []);
  }, [res.data, setInboxes]);

  return res;
};

export const useGetMe = () =>
  useQuery<User>({
    queryKey: ['me'],
    queryFn: () => fetcher('/me'),
    staleTime: Infinity,
  });
