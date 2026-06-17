import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import type { User } from '@/features/profile/types/user.types';

export interface RefreshTokenResponse {
  accessToken: string;
  user: User;
}

export async function refreshTokenRequest(options?: { token?: string | null }) {
  return apiRequest<RefreshTokenResponse>(apiEndpoints.auth.refreshToken, {
    method: 'POST',
    token: options?.token,
  });
}
