import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeAuthSession } from './normalize';
import type { LoginInput, AuthSession } from '../types/auth.types';

export async function loginRequest(input: LoginInput): Promise<AuthSession> {
  const response = await apiRequest<unknown>(apiEndpoints.auth.login, {
    method: 'POST',
    body: input,
  });

  return normalizeAuthSession(response);
}
