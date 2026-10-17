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
