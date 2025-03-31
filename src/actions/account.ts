import type { User } from 'src/types/users';

import { useQuery } from '@tanstack/react-query';

import { fetcher } from 'src/utils/axios';

interface Category {
  type: 'ALL' | 'MINE' | 'UNASSIGNED' | 'RESOLVED';
  number: number;
}

interface Inbox {
  id: string;
  name: string;
  channelType: 'EMAIL' | 'WIDGET';
  categories: Category[];
}

interface WorkspaceData {
  name: string;
  inboxes: Inbox[];
  categories: Category[];
}

export const useGetWorkspaceData = () =>
  useQuery<WorkspaceData>({
    queryKey: ['account-workspace'],
    queryFn: () => fetcher('/account/workspace'),
  });

export const useGetMe = () =>
  useQuery<User>({
    queryKey: ['me'],
    queryFn: () => fetcher('/me'),
  });

export const useGetMeCached = () => useQuery<User>({ queryKey: ['me'] });
