import type { Notification } from 'src/types/notifications';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

import { useNotificationStore } from 'src/stores/notification';

export const useGetNotifications = () => {
  const { setNotifications } = useNotificationStore();

  const res = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => fetcher('/notification'),
  });

  useEffect(() => {
    setNotifications(res.data || []);
  }, [setNotifications, res.data]);
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('post', `/notification/${id}:read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const readNotification = (id: string): Promise<void> =>
  mutationFetcher('post', `/notification/${id}:read`);
