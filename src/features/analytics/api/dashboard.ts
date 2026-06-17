import {
  apiRequest,
  isRecord,
  unwrapData,
  type ApiRecord,
} from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { readNumber, readTimeSeries, readTopLinks } from './normalize';
import type {
  DashboardAnalytics,
  ApiDashboardAnalytics,
} from '../types/analytics.types';

export async function getDashboardAnalyticsRequest(options?: {
  token?: string | null;
}): Promise<DashboardAnalytics> {
  const response = await apiRequest<ApiDashboardAnalytics>(
    apiEndpoints.analytics.dashboard,
    {
      token: options?.token,
    },
  );
  const payload = unwrapData<ApiDashboardAnalytics>(response);
  const record = (
    isRecord(payload) ? payload : {}
  ) as Partial<ApiDashboardAnalytics> & ApiRecord;

  return {
    totalLinks: readNumber(record, ['totalLinks', 'links']) ?? 0,
    totalClicks: readNumber(record, ['totalClicks', 'clicks']) ?? 0,
    uniqueVisitors: readNumber(record, ['uniqueVisitors']) ?? 0,
    activeLinks: readNumber(record, ['activeLinks']) ?? 0,
    clicksOverTime: readTimeSeries(record.clicksOverTime),
    topLinks: readTopLinks(record.topLinks),
  };
}
