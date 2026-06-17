import { apiRequest, getErrorMessage } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';

export async function logoutRequest(options?: { token?: string | null }) {
  try {
    await apiRequest<Record<string, never>>(apiEndpoints.auth.logout, {
      method: 'GET',
      token: options?.token,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(getErrorMessage(error));
    }
  }
}
