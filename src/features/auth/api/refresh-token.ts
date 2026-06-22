import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeAuthSession } from './normalize';
import type { AuthSession } from '../types/auth.types';
import type { User } from '@/features/profile/types/user.types';

export interface RefreshTokenResponse {
  accessToken: string;
  user: User;
}

export async function refreshTokenRequest(): Promise<AuthSession> {
  const response = await apiRequest<RefreshTokenResponse>(apiEndpoints.auth.refreshToken);

  return normalizeAuthSession(response);
}
