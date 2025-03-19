import { useQuery } from '@tanstack/react-query';

import { fetcher } from 'src/utils/axios';

interface ConversationDashboardData {
  countTotal: number;
  timeAverageWaiting: number;
}

export const useGetConversationDashboardData = () =>
  useQuery<ConversationDashboardData>({
    queryKey: ['conversation-dashboard'],
    queryFn: () => fetcher('/statistic/conversation'),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

interface UsersDashboardData {
  countUsers: number;
  countUsersOnline: number;
}

export const useGetUsersDashboardData = () =>
  useQuery<UsersDashboardData>({
    queryKey: ['users-dashboard'],
    queryFn: () => fetcher('/statistic/user'),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
