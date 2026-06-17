import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeUser } from '@/features/auth/api/normalize';

import type { User } from '@/features/profile/types/user.types';

export async function updateProfileRequest(
  input: { name: string; location?: string | null },
  options?: { token?: string | null },
) {
  const response = await apiRequest<User>(apiEndpoints.auth.updateDetails, {
    method: 'PATCH',
    body: input,
    token: options?.token,
  });
  return normalizeUser(unwrapData(response));
}
