import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeUser } from '@/features/auth/api/normalize';

import type { User } from '@/features/profile/types/user.types';

export async function updateProfilePictureRequest(
  body: FormData,
  options?: { token?: string | null },
) {
  const response = await apiRequest<User>(
    apiEndpoints.auth.changeProfilePicture,
    {
      method: 'POST',
      body,
      token: options?.token,
    },
  );
  return normalizeUser(unwrapData(response));
}
