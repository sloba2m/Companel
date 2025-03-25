import type { Role, User, UserPayload } from 'src/types/users';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetcher, mutationFetcher } from 'src/utils/axios';

export const useGetUsers = () =>
  useQuery<User[]>({
    queryKey: ['user'],
    queryFn: () => fetcher('/user'),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserPayload) => mutationFetcher('post', '/user', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

interface UpdateUserInput {
  id: string;
  data: UserPayload;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserInput) =>
      mutationFetcher('put', `/user/${payload.id}`, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useGetRoles = (enabled?: boolean) =>
  useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => fetcher('/role'),
    enabled,
  });

export const useGetUserRoles = (id?: string) =>
  useQuery<Role[]>({
    queryKey: ['user-roles', id],
    queryFn: () => fetcher(`/user/${id}/role`),
    enabled: !!id,
  });

interface UpdateUserRoleInput {
  userId: string;
  roleId: string;
  action: 'revoke' | 'assign';
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserRoleInput) =>
      mutationFetcher('post', `/user/${payload.userId}/role/${payload.roleId}:${payload.action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFetcher('delete', `/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
