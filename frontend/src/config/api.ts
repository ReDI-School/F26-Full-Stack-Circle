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

const readFields = (body: Record<string, unknown>): ApiErrorFields => {
  // A Map also treats names such as "__proto__" as ordinary field names.
  const fields = new Map<string, string | string[]>();
  if (isRecord(body.fields)) {
    for (const [field, value] of Object.entries(body.fields)) {
      if (
        typeof value === 'string' ||
        (Array.isArray(value) && value.every((item) => typeof item === 'string'))
      ) {
        fields.set(field, value);
      }
    }
  }

  if (Array.isArray(body.details)) {
    for (const detail of body.details) {
      if (!isRecord(detail) || typeof detail.message !== 'string') continue;
      // Auth returns Zod issue paths; items and the central handler return field names.
      const field =
        typeof detail.field === 'string'
          ? detail.field
          : Array.isArray(detail.path) &&
              detail.path.every((part) => typeof part === 'string' || typeof part === 'number')
            ? detail.path.join('.')
            : '';
      if (!field) continue;

      const previous = fields.get(field);
      fields.set(
        field,
        previous === undefined
          ? detail.message
          : [...new Set([previous].flat().concat(detail.message))]
      );
    }
  }

  // Unlike defineProperty's defaults, these properties can be updated or deleted by forms.
  return Object.fromEntries(fields);
};

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
  let fields: ApiErrorFields = {};
  if (isRecord(payload)) {
    // Accept current responses and #111's nested { error: { message, details } }.
    const body = isRecord(payload.error) ? payload.error : payload;
    if (typeof body.message === 'string' && body.message) {
      message = body.message;
    } else if (typeof body.error === 'string' && body.error) {
      message = body.error;
    }
    fields = readFields(body);
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
