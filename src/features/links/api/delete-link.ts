import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';

export async function deleteLinkRequest(
  id: string | number,
  options?: { token?: string | null },
) {
  await apiRequest<unknown>(apiEndpoints.links.detail(id), {
    method: 'DELETE',
    token: options?.token,
  });
}
