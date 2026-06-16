import 'server-only';

import { apiRequest } from '@/lib/api/client';
import { getSession } from '@/lib/auth/session';

type AuthApiOptions = Parameters<typeof apiRequest>[1];

export async function authApiRequest<T>(
  path: string,
  options: AuthApiOptions = {},
) {
  const session = await getSession();

  return apiRequest<T>(path, {
    ...options,
    token: session?.accessToken,
  });
}
