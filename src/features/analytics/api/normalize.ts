import { isRecord } from '@/lib/api/client';
import { readNumber, readString } from '@/lib/api/normalize';
import type {
  BreakdownPoint,
  DashboardAnalytics,
  TimeSeriesPoint,
} from '@/features/analytics/types/analytics.types';

export function readTimeSeries(value: unknown): TimeSeriesPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = isRecord(item) ? item : {};

    return {
      date: readString(record, ['date', 'day', 'createdAt']) ?? '',
      clicks: readNumber(record, ['clicks', 'total']) ?? 0,
      uniqueVisitors: readNumber(record, ['uniqueVisitors']),
    };
  });
}

export function readBreakdown(value: unknown): BreakdownPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = isRecord(item) ? item : {};

    return {
      name: readString(record, ['name', 'label', 'country', 'browser', 'device']) ?? 'Unknown',
      value: readNumber(record, ['value', 'count', 'clicks']) ?? 0,
    };
  });
}

export function readTopLinks(value: unknown): DashboardAnalytics['topLinks'] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = isRecord(item) ? item : {};

    return {
      id: readNumber(record, ['id', 'linkId', 'link_id']) ?? 0,
      shortCode: readString(record, ['shortCode', 'short_code']) ?? '',
      originalUrl: readString(record, ['originalUrl', 'original_url']) ?? '',
      clicks: readNumber(record, ['clicks', 'totalClicks']) ?? 0,
    };
  });
}
