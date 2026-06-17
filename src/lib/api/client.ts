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
}

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:3000/api/v1'
  ).replace(/\/$/, '');
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  response: T;
  message: string;
  headers?: Headers;
}

export async function apiRequest<T = unknown>(
  path: string,
  { body, headers, query, token, ...init }: ApiRequestOptions = {},
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

  // Forward incoming browser request cookies to backend if on the server
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
      if (cookieHeader) {
        requestHeaders.set('Cookie', cookieHeader);
      }
    } catch {
      // Ignored outside of request context (e.g. static generation)
    }
  }

  if (body !== undefined) {
    if (isPlainObject(body)) {
      requestHeaders.set('Content-Type', 'application/json');
      requestInit.body = JSON.stringify(body);
    } else {
      requestInit.body = body;
    }
  }

  const response = await fetch(requestUrl, requestInit);
  const payload = await readPayload(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, response),
      response.status,
      payload,
    );
  }

  // Forward Set-Cookie response headers from backend to browser if on the server
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
