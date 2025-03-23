import type { GetParams, GetRsponse } from 'src/types/common';
import type { Customer, CustomerPayload } from 'src/types/customers';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetCustomers = ({ page = 0, size = 10, search, sort = 'name,desc' }: GetParams) => {
  const params: GetParams = {
    page,
    size,
    search,
    sort,
  };

  return useQuery<GetRsponse<Customer>>({
    queryKey: ['customers', { page, size, search, sort }],
    queryFn: () =>
      fetcher([
        '/customer',
        {
          params,
        },
      ]),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerPayload) => mutationFetcher('post', '/customer', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
