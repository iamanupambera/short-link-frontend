import { apiRequest, isRecord, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { readNumber, readTimeSeries, readTopLinks } from './normalize';
import type { DashboardAnalytics } from '../types/analytics.types';

export async function getDashboardAnalyticsRequest(options?: {
  token?: string | null;
}): Promise<DashboardAnalytics> {
  const response = await apiRequest<unknown>(apiEndpoints.analytics.dashboard, {
    token: options?.token,
  });
  const payload = unwrapData(response);
  const record = isRecord(payload) ? payload : {};

  return {
    totalLinks: readNumber(record, ['totalLinks', 'links']) ?? 0,
    totalClicks: readNumber(record, ['totalClicks', 'clicks']) ?? 0,
    uniqueVisitors: readNumber(record, ['uniqueVisitors']) ?? 0,
    activeLinks: readNumber(record, ['activeLinks']) ?? 0,
    clicksOverTime: readTimeSeries(record.clicksOverTime),
    topLinks: readTopLinks(record.topLinks),
  };
}
