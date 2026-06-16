import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLinksRequest,
  getLinkRequest,
} from '@/features/links/api/get-links';
import { createLinkRequest } from '@/features/links/api/create-link';
import { updateLinkRequest } from '@/features/links/api/update-link';
import { deleteLinkRequest } from '@/features/links/api/delete-link';
import { queryKeys } from '@/lib/query/query-keys';
import { useAuthState } from '@/features/auth/store/use-auth';
import type {
  CreateLinkInput,
  UpdateLinkInput,
  LinkListFilters,
} from '@/features/links/types/link.types';

export function useLinks(filters: LinkListFilters = {}) {
  const { accessToken } = useAuthState();

  return useQuery({
    queryKey: queryKeys.links.list(filters),
    queryFn: () => getLinksRequest(filters, { token: accessToken }),
    enabled: !!accessToken,
  });
}

export function useLinkDetail(id: string | number) {
  const { accessToken } = useAuthState();

  return useQuery({
    queryKey: queryKeys.links.detail(id),
    queryFn: () => getLinkRequest(id, { token: accessToken }),
    enabled: !!accessToken && !!id,
  });
}

export function useCreateLink() {
  const { accessToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLinkInput) =>
      createLinkRequest(input, { token: accessToken }),
    onSuccess: () => {
      // Invalidates both links.all list and individual keys starting with ['links']
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all });
    },
  });
}

export function useUpdateLink(id: string | number) {
  const { accessToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateLinkInput) =>
      updateLinkRequest(id, input, { token: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all });
    },
  });
}

export function useDeleteLink() {
  const { accessToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      deleteLinkRequest(id, { token: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all });
    },
  });
}
