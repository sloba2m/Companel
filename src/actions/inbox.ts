import type { Inbox, InboxPayload } from 'src/types/inbox';
import type { GetParams, GetRsponse } from 'src/types/common';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetInboxes = ({ page = 0, size = 10, search, sort = 'name,desc' }: GetParams) => {
  const params: GetParams = {
    page,
    size,
    search,
    sort,
  };

  return useQuery<GetRsponse<Inbox>>({
    queryKey: ['inbox', { page, size, search, sort }],
    queryFn: () =>
      fetcher([
        '/inbox',
        {
          params,
        },
      ]),
  });
};

export const useCreateInbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InboxPayload) => mutationFetcher('post', '/inbox', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
};

interface UpdateInboxInput {
  id: string;
  data: InboxPayload;
}

export const useUpdateInbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateInboxInput) =>
      mutationFetcher('put', `/inbox/${payload.id}`, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
};

export const useDeleteInbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('delete', `/inbox/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
};
