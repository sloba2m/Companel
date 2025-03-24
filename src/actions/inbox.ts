import type { Inbox } from 'src/types/inbox';
import type { GetParams, GetRsponse } from 'src/types/common';

import { useQuery } from '@tanstack/react-query';

import { fetcher } from 'src/utils/axios';

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
