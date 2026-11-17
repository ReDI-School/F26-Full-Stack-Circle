import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './api';

afterEach(() => vi.unstubAllGlobals());

describe('api', () => {
  it('uses /api, JSON and credentials for every verb, preserving the abort signal', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({ id: 'item-1' }));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    const options = { signal: controller.signal };

    expect(await api.get<{ id: string }>('/items?category=books', options)).toEqual({
      id: 'item-1',
    });
    await api.post('items', { title: 'Book' }, options);
    await api.patch('/items/item-1', { price: 10 }, options);
    await api.del('/items/item-1', options);

    for (const [index, method] of ['GET', 'POST', 'PATCH', 'DELETE'].entries()) {
      expect(fetchMock).toHaveBeenNthCalledWith(index + 1, expect.stringMatching(/^\/api\//), {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: [undefined, '{"title":"Book"}', '{"price":10}', undefined][index],
      });
    }
    expect(fetchMock.mock.calls[0][0]).toBe('/api/items?category=books');
    expect(fetchMock.mock.calls[1][0]).toBe('/api/items');
  });

  it('returns null for 204 without trying to parse JSON', async () => {
    const response = new Response(null, { status: 204 });
    const json = vi.spyOn(response, 'json');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    expect(await api.del('/items/item-1')).toBeNull();
    expect(json).not.toHaveBeenCalled();
  });

  it('preserves validation status, message and per-field errors', async () => {
    const fields = { email: ['Enter a valid email.'], title: 'Required' };
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(Response.json({ message: 'Invalid input', fields }, { status: 400 }))
    );
    const failure = api.post('/items', {});
    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({ status: 400, message: 'Invalid input', fields });
  });

  it('supports the existing backend error property', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(Response.json({ error: 'Wrong email or password.' }, { status: 401 }))
    );
    await expect(api.post('/auth/login', {})).rejects.toMatchObject({
      status: 401,
      message: 'Wrong email or password.',
      fields: {},
    });
  });

  it.each(['<html>Bad Gateway</html>', '', 'null', '{"fields":{"price":42}}'])(
    'still produces an ApiError for an unexpected error body: %s',
    async (body) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, { status: 502 })));
      await expect(api.get('/items')).rejects.toMatchObject({
        name: 'ApiError',
        status: 502,
        message: 'Request failed (502).',
        fields: {},
      });
    }
  );

  it.each([
    {
      name: 'item creation field map',
      payload: { error: 'Validation failed', fields: { title: 'Too short' } },
      message: 'Validation failed',
      fields: { title: 'Too short' },
    },
    {
      name: 'auth Zod issues',
      payload: {
        error: 'Invalid email',
        details: [
          { path: ['email'], message: 'Invalid email', code: 'invalid_format' },
          { path: ['password'], message: 'Too short' },
          { path: ['photos', 0, 'url'], message: 'Invalid URL' },
        ],
      },
      message: 'Invalid email',
      fields: { email: 'Invalid email', password: 'Too short', 'photos.0.url': 'Invalid URL' },
    },
    {
      name: 'item query field details',
      payload: {
        error: 'Validation Error',
        details: [{ field: 'take', message: 'Invalid number' }],
      },
      message: 'Validation Error',
      fields: { take: 'Invalid number' },
    },
    {
      name: 'central handler validation',
      payload: {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request.',
          details: [
            { field: 'title', message: 'Too short' },
            { field: 'title', message: 'Unsupported characters' },
          ],
        },
      },
      message: 'Invalid request.',
      fields: { title: ['Too short', 'Unsupported characters'] },
    },
    {
      name: 'central handler non-validation error',
      payload: { error: { code: 'UNAUTHORIZED', message: 'Please log in.', details: null } },
      message: 'Please log in.',
      fields: {},
    },
  ])('reads $name', async ({ payload, message, fields }) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(payload, { status: 400 })));
    await expect(api.post('/items', {})).rejects.toMatchObject({ status: 400, message, fields });
  });

  it('ignores malformed and root-level details without losing valid field errors', async () => {
    const payload = {
      error: 'Invalid input',
      details: [
        null,
        'invalid',
        { field: 'title', message: 42 },
        { path: [null], message: 'Invalid path' },
        { path: [], message: 'Invalid body' },
        { field: '', message: 'Invalid body' },
        { field: 'title', message: 'Required' },
      ],
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(payload, { status: 400 })));
    await expect(api.post('/items', {})).rejects.toMatchObject({
      message: 'Invalid input',
      fields: { title: 'Required' },
    });
  });

  it('lets forms update, add and remove server field errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: 'Invalid input',
            fields: { title: 'Too short' },
          },
          { status: 400 }
        )
      )
    );
    const error = await api.post('/items', {}).catch((reason: ApiError) => reason);
    expect(error).toBeInstanceOf(ApiError);
    const fields = (error as ApiError).fields;
    fields.title = 'Client-side message';
    fields.description = 'Required';
    expect(fields).toEqual({ title: 'Client-side message', description: 'Required' });
    delete fields.title;
    expect(fields).toEqual({ description: 'Required' });
  });

  it('keeps special field names as mutable own properties without changing the prototype', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: 'Invalid input',
            fields: JSON.parse('{"__proto__":"Invalid","constructor":"Required"}'),
            details: [{ field: 'toString', message: 'Invalid value' }],
          },
          { status: 400 }
        )
      )
    );
    const error = await api.post('/items', {}).catch((reason: ApiError) => reason);
    const fields = (error as ApiError).fields;
    expect(Object.getPrototypeOf(fields)).toBe(Object.prototype);
    expect(Object.hasOwn(fields, '__proto__')).toBe(true);
    expect(fields['__proto__']).toBe('Invalid');
    fields['__proto__'] = 'Updated';
    delete fields['constructor'];
    expect(fields['__proto__']).toBe('Updated');
    expect(Object.hasOwn(fields, 'constructor')).toBe(false);
    expect(fields['toString']).toBe('Invalid value');
  });

  it('preserves network and abort failures', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    for (const failure of [
      new TypeError('Failed to fetch'),
      new DOMException('Aborted', 'AbortError'),
    ]) {
      fetchMock.mockRejectedValueOnce(failure);
      await expect(api.get('/items')).rejects.toBe(failure);
    }
  });
});
