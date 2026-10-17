import { apiUrl } from './index';

export type ApiErrorFields = Record<string, string | string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly fields: ApiErrorFields;

  constructor(status: number, message: string, fields: ApiErrorFields = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

type RequestOptions = Pick<RequestInit, 'signal'>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readError = async (response: Response): Promise<ApiError> => {
  // A proxy may return HTML or an empty body instead of the API's JSON error.
  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = null;
  }

  let message = `Request failed (${response.status}).`;
  const fields: ApiErrorFields = {};
  if (isRecord(payload)) {
    if (typeof payload.message === 'string' && payload.message) {
      message = payload.message;
    } else if (typeof payload.error === 'string' && payload.error) {
      message = payload.error;
    }

    if (isRecord(payload.fields)) {
      for (const [field, value] of Object.entries(payload.fields)) {
        if (
          typeof value === 'string' ||
          (Array.isArray(value) && value.every((item) => typeof item === 'string'))
        ) {
          Object.defineProperty(fields, field, { value, enumerable: true });
        }
      }
    }
  }

  return new ApiError(response.status, message, fields);
};

const request = async <T>(
  method: string,
  path: string,
  body: unknown,
  options?: RequestOptions
): Promise<T | null> => {
  const response = await fetch(apiUrl(path), {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: options?.signal,
  });

  if (!response.ok) throw await readError(response);
  if (response.status === 204) return null;
  return response.json() as Promise<T>;
};

/** Browser API client. Paths are relative to /api; 204 responses return null. */
export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  patch: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  del: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};
