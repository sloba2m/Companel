import type { Template, TemplatePayload } from 'src/types/templates';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetTemplates = () =>
  useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: () => fetcher('/template/email'),
  });

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TemplatePayload) => mutationFetcher('post', '/template/email', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

interface LogoPayload {
  id: string;
  file: File;
}

export const useUploadLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LogoPayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);

      return mutationFetcher('post', `/template/email/${payload.id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json, text/plain, */*',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

interface UpdateTemplateInput {
  id: string;
  data: TemplatePayload;
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTemplateInput) =>
      mutationFetcher('put', `/template/email/${payload.id}`, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('delete', `/template/email/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};
