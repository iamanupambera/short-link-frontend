import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeAuthSession } from './normalize';
import type { LoginInput, AuthSession } from '../types/auth.types';

import type { User } from '@/features/profile/types/user.types';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export async function loginRequest(input: LoginInput): Promise<AuthSession> {
  const response = await apiRequest<LoginResponse>(apiEndpoints.auth.login, {
    method: 'POST',
    body: input,
  });

  return normalizeAuthSession(response);
}
