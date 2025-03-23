import type { PageInfo } from 'src/types/common';
import type { Customer } from 'src/types/customers';

import { useQuery } from '@tanstack/react-query';

import { fetcher } from 'src/utils/axios';

interface UseGetConversationsParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
}

export interface CustomersResponse {
  content: Customer[];
  page: PageInfo;
}

export const useGetCustomers = ({
  page = 0,
  size = 10,
  search,
  sort = 'name,desc',
}: UseGetConversationsParams) => {
  const params: Record<string, any> = {
    page,
    size,
    search,
    sort,
  };

  return useQuery<CustomersResponse>({
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
