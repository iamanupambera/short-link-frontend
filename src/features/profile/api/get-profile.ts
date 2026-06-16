import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeUser } from '@/features/auth/api/normalize';

export async function getProfileRequest(options?: { token?: string | null }) {
  const response = await apiRequest<unknown>(apiEndpoints.auth.getMe, {
    token: options?.token,
  });
  return normalizeUser(unwrapData(response));
}
