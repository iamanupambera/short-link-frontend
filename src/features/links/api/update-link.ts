import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeLink } from './normalize';
import type { UpdateLinkInput } from '../types/link.types';

export async function updateLinkRequest(
  id: string | number,
  input: UpdateLinkInput,
  options?: { token?: string | null },
) {
  const response = await apiRequest<unknown>(apiEndpoints.links.detail(id), {
    method: 'PATCH',
    body: input,
    token: options?.token,
  });

  return normalizeLink(unwrapData(response));
}
