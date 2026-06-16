import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';

export async function refreshTokenRequest(options?: { token?: string | null }) {
  return apiRequest<unknown>(apiEndpoints.auth.refreshToken, {
    method: 'POST',
    token: options?.token,
  });
}
