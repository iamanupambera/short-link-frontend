import { isRecord, unwrapData, type ApiResponse, type ApiRecord } from '@/lib/api/client';
import { readBoolean, readNullableString, readNumber, readString } from '@/lib/api/normalize';
import type { AuthSession } from '@/features/auth/types/auth.types';
import type { User, UserRole, UserStatus } from '@/features/profile/types/user.types';
import type { LoginResponse } from './login';

export function normalizeAuthSession(response: ApiResponse<LoginResponse> | unknown): AuthSession {
  const payload = unwrapData<LoginResponse>(response);
  const record = (isRecord(payload) ? payload : {}) as ApiRecord;
  const tokenSource = isRecord(record['tokens']) ? (record['tokens'] as ApiRecord) : record;
  const accessToken = readString(tokenSource, ['accessToken', 'access_token', 'token']);
  const userSource = isRecord(record['user']) ? (record['user'] as ApiRecord) : record;

  if (!accessToken) {
    throw new Error('Login response did not include an access token.');
  }

  return {
    user: normalizeUser(userSource),
    accessToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  };
}

export function normalizeUser(value: unknown): User {
  const record = isRecord(value) ? value : {};

  return {
    id: readNumber(record, ['id']) ?? 0,
    name:
      readString(record, ['name', 'fullName', 'username']) ??
      readString(record, ['email']) ??
      'ShortLink user',
    email: readString(record, ['email']) ?? '',
    location: readNullableString(record, ['location']),
    profilePicture: readNullableString(record, ['profilePicture', 'profile_picture', 'avatar']),
    isEmailVerified: readBoolean(record, ['isEmailVerified', 'verified', 'emailVerified']) ?? false,
    role: normalizeRole(readString(record, ['role'])),
    status: normalizeStatus(readString(record, ['status'])),
  };
}

export function normalizeRole(value?: string): UserRole {
  if (value === 'ADMIN' || value === 'SUPER_ADMIN') {
    return value;
  }

  return 'USER';
}

export function normalizeStatus(value?: string): UserStatus {
  return value === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
}

export function readMessage(value: unknown) {
  const payload = unwrapData(value);
  return isRecord(payload) ? readString(payload, ['message']) : undefined;
}
