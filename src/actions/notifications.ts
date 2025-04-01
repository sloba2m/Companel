import type { Notification } from 'src/types/notifications';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetNotifications = () =>
  useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => fetcher('/notification'),
  });

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('post', `/notification/${id}:read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
