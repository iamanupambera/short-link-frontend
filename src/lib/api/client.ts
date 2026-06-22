import { publicEnv } from '@/env';
import type { AuthSession } from '@/features/auth/types/auth.types';

const REFRESH_TOKEN_PATH = '/auth/refresh-token';
const TOKEN_REFRESHED_EVENT = 'shortlink:token-refreshed';

type SessionPersister = (session: Omit<AuthSession, 'expiresAt'>) => Promise<void>;
let _persistSession: SessionPersister | null = null;

export function registerSessionPersister(persister: SessionPersister) {
  _persistSession = persister;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type QueryValue = string | number | boolean | null | undefined;

export interface ApiRecord {
  [key: string]: unknown;
}

export interface QueryParams {
  [key: string]: QueryValue;
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | ApiRecord;
  query?: QueryParams;
  token?: string | null;
  skipAuthRefresh?: boolean;
}

export function getApiBaseUrl() {
  return publicEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  response: T;
  message: string;
  headers?: Headers;
}

export async function apiRequest<T = unknown>(
  path: string,
  { body, headers, query, token, skipAuthRefresh, ...init }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const requestHeaders = new Headers(headers);
  const requestUrl = buildUrl(path, query);
  const requestInit: RequestInit = {
    ...init,
    headers: requestHeaders,
    cache: init.cache ?? 'no-store',
    credentials: init.credentials ?? 'include',
  };

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  await forwardRequestCookies(requestHeaders);

  if (body !== undefined) {
    if (isPlainObject(body)) {
      requestHeaders.set('Content-Type', 'application/json');
      requestInit.body = JSON.stringify(body);
    } else {
      requestInit.body = body;
    }
  }

  let response = await fetch(requestUrl, requestInit);
  let payload = await readPayload(response);

  if (
    shouldRefreshAuth({
      path,
      response,
      skipAuthRefresh,
      token,
    })
  ) {
    const refreshedSession = await refreshAccessToken();

    if (refreshedSession) {
      requestHeaders.set('Authorization', `Bearer ${refreshedSession.accessToken}`);
      response = await fetch(requestUrl, requestInit);
      payload = await readPayload(response);
    }
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, response), response.status, payload);
  }

  await forwardResponseCookies(response);

  return {
    ...(isRecord(payload) ? payload : {}),
    headers: response.headers,
  } as ApiResponse<T>;
}

export function getErrorMessage(error: unknown, response?: Response) {
  if (isRecord(error)) {
    const message = error.message ?? error.error;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return response?.statusText || 'Something went wrong. Please try again.';
}

export function unwrapData<T>(value: ApiResponse<T> | unknown): T {
  if (isRecord(value)) {
    if ('response' in value) {
      return value.response as T;
    }
    if ('data' in value) {
      return value.data as T;
    }
  }

  return value as T;
}

export function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function forwardRequestCookies(headers: Headers) {
  if (typeof window !== 'undefined') {
    return;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    if (cookieHeader) {
      headers.set('Cookie', cookieHeader);
    }
  } catch {
    // Ignored outside of request context (e.g. static generation)
  }
}

async function forwardResponseCookies(response: Response) {
  if (typeof window === 'undefined') {
    try {
      const setCookies = response.headers.getSetCookie?.() || [];
      if (setCookies.length > 0) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        for (const setCookieStr of setCookies) {
          const parts = setCookieStr.split(';').map((p) => p.trim());
          if (parts.length === 0) continue;

          const [nameValue, ...directives] = parts;
          const eqIdx = nameValue.indexOf('=');
          if (eqIdx === -1) continue;

          const name = nameValue.slice(0, eqIdx);
          const value = nameValue.slice(eqIdx + 1);

          const options: {
            path?: string;
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: 'lax' | 'strict' | 'none';
            expires?: Date;
            maxAge?: number;
          } = { path: '/' };

          for (const directive of directives) {
            const lower = directive.toLowerCase();
            if (lower === 'httponly') {
              options.httpOnly = true;
            } else if (lower === 'secure') {
              options.secure = true;
            } else if (lower.startsWith('path=')) {
              options.path = directive.slice(5);
            } else if (lower.startsWith('samesite=')) {
              const val = directive.slice(9).toLowerCase();
              options.sameSite =
                val === 'lax'
                  ? 'lax'
                  : val === 'strict'
                    ? 'strict'
                    : val === 'none'
                      ? 'none'
                      : undefined;
            } else if (lower.startsWith('expires=')) {
              options.expires = new Date(directive.slice(8));
            } else if (lower.startsWith('max-age=')) {
              options.maxAge = parseInt(directive.slice(8), 10);
            }
          }
          cookieStore.set(name, value, options);
        }
      }
    } catch {
      // Ignored outside of request context
    }
  }
}

function shouldRefreshAuth({
  path,
  response,
  skipAuthRefresh,
  token,
}: {
  path: string;
  response: Response;
  skipAuthRefresh?: boolean;
  token?: string | null;
}) {
  return (
    !skipAuthRefresh &&
    Boolean(token) &&
    path !== REFRESH_TOKEN_PATH &&
    (response.status === 401 || response.status === 403)
  );
}

async function refreshAccessToken() {
  try {
    const headers = new Headers();
    await forwardRequestCookies(headers);

    const response = await fetch(buildUrl(REFRESH_TOKEN_PATH), {
      headers,
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });
    const payload = await readPayload(response);

    if (!response.ok) {
      return null;
    }

    await forwardResponseCookies(response);

    const session = readAuthSession(payload);
    if (!session) {
      return null;
    }

    await persistRefreshedSession(session);
    notifyTokenRefreshed(session);

    return session;
  } catch {
    return null;
  }
}

function readAuthSession(value: unknown): Omit<AuthSession, 'expiresAt'> | null {
  const payload = unwrapData(value);
  const record = isRecord(payload) ? payload : {};
  const accessToken = readString(record, ['accessToken', 'access_token', 'token']);
  const user = isRecord(record.user) ? record.user : null;

  if (!accessToken || !user) {
    return null;
  }

  return {
    accessToken,
    user: user as unknown as AuthSession['user'],
  };
}

async function persistRefreshedSession(session: Omit<AuthSession, 'expiresAt'>) {
  if (typeof window !== 'undefined' || !_persistSession) {
    return;
  }

  await _persistSession(session);
}

function notifyTokenRefreshed(session: Omit<AuthSession, 'expiresAt'>) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(TOKEN_REFRESHED_EVENT, {
      detail: session,
    }),
  );
}

function readString(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function buildUrl(path: string, query?: QueryParams) {
  const baseUrl = getApiBaseUrl();
  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function readPayload(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isPlainObject(value: unknown): value is ApiRecord {
  return Object.prototype.toString.call(value) === '[object Object]';
}
