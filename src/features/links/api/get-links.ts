import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { getArrayPayload, normalizeLink, readTotal } from './normalize';
import type { LinkListFilters, LinkListResponse } from '../types/link.types';

export async function getLinksRequest(
  filters: LinkListFilters = {},
  options?: { token?: string | null },
): Promise<LinkListResponse> {
  const response = await apiRequest<unknown>(apiEndpoints.links.base, {
    query: filters as Record<string, string>,
    token: options?.token,
  });
  const payload = unwrapData(response);
  const records = getArrayPayload(payload);

  return {
    links: records.map(normalizeLink),
    total: readTotal(payload, records.length),
  };
}

export async function getLinkRequest(
  id: string | number,
  options?: { token?: string | null },
) {
  const response = await apiRequest<unknown>(apiEndpoints.links.detail(id), {
    token: options?.token,
  });
  return normalizeLink(unwrapData(response));
}
