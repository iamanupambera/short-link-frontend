import { isRecord, type ApiRecord } from '@/lib/api/client';
import type { LinkStatus, ShortLink } from '@/features/links/types/link.types';

export function composeShortUrl(shortCode: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SHORT_URL_BASE ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000';

  return `${baseUrl.replace(/\/$/, '')}/${shortCode}`;
}

export function normalizeLink(value: unknown): ShortLink {
  const record = isRecord(value) ? value : {};
  const shortCode =
    readString(record, ['shortCode', 'short_code', 'customAlias']) ?? '';

  return {
    id: readNumber(record, ['id']) ?? 0,
    shortCode,
    shortUrl:
      readString(record, ['shortUrl', 'short_url']) ??
      composeShortUrl(shortCode),
    originalUrl:
      readString(record, ['originalUrl', 'original_url', 'url']) ?? '',
    customAlias: readNullableString(record, ['customAlias', 'custom_alias']),
    title: readNullableString(record, ['title']),
    status: normalizeStatus(readString(record, ['status'])),
    isPasswordProtected:
      readBoolean(record, [
        'isPasswordProtected',
        'passwordProtected',
        'hasPassword',
      ]) ?? Boolean(readString(record, ['passwordHash', 'password_hash'])),
    expiresAt: readNullableString(record, ['expiresAt', 'expires_at']),
    createdAt:
      readString(record, ['createdAt', 'created_at']) ??
      new Date().toISOString(),
    updatedAt: readNullableString(record, ['updatedAt', 'updated_at']),
    clickCount:
      readNumber(record, ['clickCount', 'clicks', 'totalClicks']) ?? 0,
    uniqueVisitors: readNumber(record, ['uniqueVisitors']),
    lastClickedAt: readNullableString(record, [
      'lastClickedAt',
      'last_clicked_at',
    ]),
  };
}

export function getArrayPayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (isRecord(payload)) {
    const candidates = [
      payload.links,
      payload.items,
      payload.data,
      payload.results,
    ];
    const match = candidates.find(Array.isArray);

    if (match) {
      return match;
    }
  }

  return [];
}

export function readTotal(payload: unknown, fallback: number) {
  if (!isRecord(payload)) {
    return fallback;
  }

  return readNumber(payload, ['total', 'count', 'totalItems']) ?? fallback;
}

export function normalizeStatus(value?: string): LinkStatus {
  if (value === 'INACTIVE' || value === 'EXPIRED') {
    return value;
  }

  return 'ACTIVE';
}

export function readString(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
}

export function readNullableString(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (value === null) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }
  }

  return null;
}

export function readNumber(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }

  return undefined;
}

export function readBoolean(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'boolean') {
      return value;
    }
  }

  return undefined;
}
