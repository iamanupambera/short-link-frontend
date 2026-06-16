import { apiRequest, isRecord, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { readBreakdown, readNumber, readTimeSeries } from './normalize';
import type { LinkAnalytics } from '../types/analytics.types';

export async function getLinkAnalyticsRequest(
  linkId: string | number,
  options?: { token?: string | null },
): Promise<LinkAnalytics> {
  const response = await apiRequest<unknown>(
    apiEndpoints.analytics.link(linkId),
    {
      token: options?.token,
    },
  );
  const payload = unwrapData(response);
  const record = isRecord(payload) ? payload : {};

  return {
    totalClicks: readNumber(record, ['totalClicks', 'clicks']) ?? 0,
    uniqueVisitors: readNumber(record, ['uniqueVisitors']) ?? 0,
    clicksOverTime: readTimeSeries(record.clicksOverTime),
    devices: readBreakdown(record.devices ?? record.deviceStats),
    browsers: readBreakdown(record.browsers ?? record.browserStats),
    countries: readBreakdown(record.countries ?? record.countryStats),
    referrers: readBreakdown(record.referrers ?? record.referrerStats),
  };
}
