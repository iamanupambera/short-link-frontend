'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalyticsRequest } from '@/features/analytics/api/dashboard';
import { getLinkAnalyticsRequest } from '@/features/analytics/api/link-analytics';
import { analyticsQueryKeys } from '../query-keys';
import { useAuthState } from '@/features/auth';

export function useDashboardAnalytics() {
  const { accessToken } = useAuthState();

  return useQuery({
    queryKey: analyticsQueryKeys.dashboard,
    queryFn: () => getDashboardAnalyticsRequest({ token: accessToken }),
    enabled: !!accessToken,
  });
}

export function useLinkAnalytics(linkId: string | number) {
  const { accessToken } = useAuthState();

  return useQuery({
    queryKey: analyticsQueryKeys.link(linkId),
    queryFn: () => getLinkAnalyticsRequest(linkId, { token: accessToken }),
    enabled: !!accessToken && !!linkId,
  });
}
