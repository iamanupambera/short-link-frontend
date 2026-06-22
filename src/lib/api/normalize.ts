import type { ApiRecord } from '@/lib/api/client';

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
