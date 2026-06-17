import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeLink } from './normalize';
import type { CreateLinkInput, ApiLink } from '../types/link.types';

export async function createLinkRequest(
  input: CreateLinkInput,
  options?: { token?: string | null },
) {
  const response = await apiRequest<ApiLink>(apiEndpoints.links.base, {
    method: 'POST',
    body: input,
    token: options?.token,
  });

  return normalizeLink(unwrapData<ApiLink>(response));
}
