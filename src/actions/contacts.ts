import type { GetParams, GetRsponse } from 'src/types/common';
import type { Contact, ContactPayload } from 'src/types/contacts';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetContacts = ({ page = 0, size = 10, search, sort = 'name,desc' }: GetParams) => {
  const params: GetParams = {
    page,
    size,
    search,
    sort,
  };

  return useQuery<GetRsponse<Contact>>({
    queryKey: ['contact', { page, size, search, sort }],
    queryFn: () =>
      fetcher([
        '/contact',
        {
          params,
        },
      ]),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContactPayload) => mutationFetcher('post', '/contact', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
};

interface UpdateContactInput {
  id: string;
  data: ContactPayload;
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContactInput) =>
      mutationFetcher('put', `/contact/${payload.id}`, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('delete', `/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
};
