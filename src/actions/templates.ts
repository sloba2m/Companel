import type { Template } from 'src/types/templates';

import { useQuery } from '@tanstack/react-query';

import { fetcher } from 'src/utils/axios';

export const useGetTemplates = () =>
  useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: () => fetcher('/template/email'),
  });
