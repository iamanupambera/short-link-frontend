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

type QueryValue = string | number | boolean | null | undefined;

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown>;
  query?: Record<string, QueryValue>;
  token?: string | null;
};

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:3000/api/v1'
  ).replace(/\/$/, '');
}

export async function apiRequest<T>(
  path: string,
  { body, headers, query, token, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  const requestUrl = buildUrl(path, query);
  const requestInit: RequestInit = {
    ...init,
    headers: requestHeaders,
    cache: init.cache ?? 'no-store',
  };

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
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

  return payload as T;
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

export function unwrapData(value: unknown): unknown {
  if (isRecord(value) && 'data' in value) {
    return value.data;
  }

  return value;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}
