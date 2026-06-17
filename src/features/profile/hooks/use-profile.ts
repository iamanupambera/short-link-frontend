'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileRequest } from '@/features/profile/api/get-profile';
import { updateProfileRequest } from '@/features/profile/api/update-profile';
import { updateProfilePictureRequest } from '@/features/profile/api/update-avatar';
import { profileQueryKeys } from '../query-keys';
import { useAuthState, useAuthDispatches } from '@/features/auth';
import { setSession } from '@/lib/auth/cookies';

export function useProfile() {
  const { accessToken } = useAuthState();
  const { updateProfile } = useAuthDispatches();

  const query = useQuery({
    queryKey: profileQueryKeys.profile,
    queryFn: () => getProfileRequest({ token: accessToken }),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (query.data) {
      updateProfile(query.data);
      if (accessToken) {
        setSession({ user: query.data, accessToken });
      }
    }
  }, [query.data, updateProfile, accessToken]);

  return query;
}

export function useUpdateProfile() {
  const { accessToken } = useAuthState();
  const { updateProfile } = useAuthDispatches();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; location?: string | null }) =>
      updateProfileRequest(input, { token: accessToken }),
    onSuccess: async (updatedUser) => {
      updateProfile(updatedUser);
      if (accessToken) {
        await setSession({ user: updatedUser, accessToken });
      }
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
    onSuccess: async (updatedUser) => {
      updateProfile(updatedUser);
      if (accessToken) {
        await setSession({ user: updatedUser, accessToken });
      }
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile });
    },
  });
}
