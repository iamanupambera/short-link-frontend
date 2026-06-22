import { publicEnv } from '@/env';
import { isRecord } from '@/lib/api/client';
import { readBoolean, readNullableString, readNumber, readString } from '@/lib/api/normalize';
import type { LinkStatus, ShortLink } from '@/features/links/types/link.types';

export function composeShortUrl(shortCode: string) {
  const baseUrl = publicEnv.NEXT_PUBLIC_SHORT_URL_BASE;
  return `${baseUrl.replace(/\/$/, '')}/${shortCode}`;
}

export function normalizeLink(value: unknown): ShortLink {
  const record = isRecord(value) ? value : {};
  const shortCode = readString(record, ['shortCode', 'short_code', 'customAlias']) ?? '';

  return {
    id: readNumber(record, ['id']) ?? 0,
    shortCode,
    shortUrl: readString(record, ['shortUrl', 'short_url']) ?? composeShortUrl(shortCode),
    originalUrl: readString(record, ['originalUrl', 'original_url', 'url']) ?? '',
    customAlias: readNullableString(record, ['customAlias', 'custom_alias']),
    title: readNullableString(record, ['title']),
    status: normalizeStatus(readString(record, ['status'])),
    isPasswordProtected:
      readBoolean(record, ['isPasswordProtected', 'passwordProtected', 'hasPassword']) ??
      Boolean(readString(record, ['passwordHash', 'password_hash'])),
    expiresAt: readNullableString(record, ['expiresAt', 'expires_at']),
    createdAt: readString(record, ['createdAt', 'created_at']) ?? new Date().toISOString(),
    updatedAt: readNullableString(record, ['updatedAt', 'updated_at']),
    clickCount: readNumber(record, ['clickCount', 'clicks', 'totalClicks']) ?? 0,
    uniqueVisitors: readNumber(record, ['uniqueVisitors']),
    lastClickedAt: readNullableString(record, ['lastClickedAt', 'last_clicked_at']),
  };
}

export function getArrayPayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (isRecord(payload)) {
    const candidates = [payload.links, payload.items, payload.data, payload.results];
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
