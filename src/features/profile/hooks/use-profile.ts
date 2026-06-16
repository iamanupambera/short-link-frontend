'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileRequest } from '@/features/profile/api/get-profile';
import { updateProfileRequest } from '@/features/profile/api/update-profile';
import { updateProfilePictureRequest } from '@/features/profile/api/update-avatar';
import { profileQueryKeys } from '../query-keys';
import { useAuthState, useAuthDispatches } from '@/features/auth';

export function useProfile() {
  const { accessToken } = useAuthState();

  return useQuery({
    queryKey: profileQueryKeys.profile,
    queryFn: () => getProfileRequest({ token: accessToken }),
    enabled: !!accessToken,
  });
}

export function useUpdateProfile() {
  const { accessToken } = useAuthState();
  const { updateProfile } = useAuthDispatches();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; location?: string | null }) =>
      updateProfileRequest(input, { token: accessToken }),
    onSuccess: (updatedUser) => {
      updateProfile(updatedUser);
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile });
    },
  });
}

export function useUpdateProfilePicture() {
  const { accessToken } = useAuthState();
  const { updateProfile } = useAuthDispatches();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FormData) =>
      updateProfilePictureRequest(body, { token: accessToken }),
    onSuccess: (updatedUser) => {
      updateProfile(updatedUser);
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile });
    },
  });
}
