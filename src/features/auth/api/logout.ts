import { apiRequest, getErrorMessage } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';

export async function logoutRequest(options?: { token?: string | null }) {
  try {
    await apiRequest<unknown>(apiEndpoints.auth.logout, {
      method: 'POST',
      token: options?.token,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(getErrorMessage(error));
    }
  }
}
