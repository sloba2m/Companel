import type { Tag } from 'src/types/tags';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetTags = () =>
  useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => fetcher('/tag'),
  });

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => mutationFetcher('post', '/tag', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

interface UpdateTagInput {
  id: string;
  name: string;
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTagInput) =>
      mutationFetcher('put', `/tag/${payload.id}`, { name: payload.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('delete', `/tag/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
