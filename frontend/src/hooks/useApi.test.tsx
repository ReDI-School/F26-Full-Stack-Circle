import React, { act, StrictMode, useLayoutEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import useApi from './useApi';

type Data = { items: string[] };
type Pending = {
  signal: AbortSignal;
  resolve: (response: Response) => void;
  reject: (reason: unknown) => void;
};

let container: HTMLDivElement;
let root: Root | null;
let pending: Pending[];
let current: ReturnType<typeof useApi<Data>>;

const Probe = ({ url }: { url: string }) => {
  const result = useApi<Data>(url);
  useLayoutEffect(() => {
    current = result;
  });
  return <output>{JSON.stringify(result)}</output>;
};

const render = async (url = '/items') => {
  await act(async () => root?.render(<Probe url={url} />));
};

const respond = async (index: number, items: string[]) => {
  await act(async () => pending[index].resolve(Response.json({ items })));
};

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  pending = [];
  // Deliberately ignore abort in this transport: even a late completion must be ignored.
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (_url, options: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          pending.push({ signal: options.signal as AbortSignal, resolve, reject });
        })
    )
  );
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root?.unmount());
  root = null;
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('starts loading, then returns data, including an empty list', async () => {
  await render();
  expect(current).toMatchObject({ data: null, error: null, loading: true });
  await respond(0, []);
  expect(current).toMatchObject({ data: { items: [] }, error: null, loading: false });
});

it('exposes API errors and allows a successful manual retry', async () => {
  await render();
  await act(async () => pending[0].resolve(Response.json({ error: 'Try later' }, { status: 503 })));
  expect(current).toMatchObject({
    data: null,
    error: { status: 503, message: 'Try later' },
    loading: false,
  });
  const refetch = current.refetch;
  await act(async () => current.refetch());
  expect(current).toMatchObject({ data: null, error: null, loading: true });
  await respond(1, ['recovered']);
  expect(current.data).toEqual({ items: ['recovered'] });
  expect(current.refetch).toBe(refetch);
});

it('shows network failures without retrying automatically', async () => {
  await render();
  await act(async () => pending[0].reject(new TypeError('Offline')));
  expect(current.error?.message).toBe('Offline');
  expect(current.loading).toBe(false);
  expect(pending).toHaveLength(1);
});

it('aborts the old URL and ignores its late response', async () => {
  await render('/items?q=den');
  await render('/items?q=denim');
  expect(pending[0].signal.aborted).toBe(true);
  await respond(1, ['denim']);
  await respond(0, ['den']);
  expect(current).toMatchObject({ data: { items: ['denim'] }, error: null, loading: false });
});

it('ignores an old failure while the newer request is still loading', async () => {
  await render('/items?q=den');
  await render('/items?q=denim');
  await act(async () => pending[0].reject(new Error('Old failure')));
  expect(current).toMatchObject({ data: null, error: null, loading: true });
  await respond(1, ['denim']);
});

it('does not reuse a completed result when navigating A -> B -> A', async () => {
  await render('/items?q=a');
  await respond(0, ['old A']);
  await render('/items?q=b');
  await render('/items?q=a');
  expect(current).toMatchObject({ data: null, error: null, loading: true });
  expect(pending[1].signal.aborted).toBe(true);
  await respond(2, ['new A']);
  expect(current.data).toEqual({ items: ['new A'] });
});

it('cancels earlier refetches of the same URL', async () => {
  await render();
  await act(async () => current.refetch());
  await act(async () => current.refetch());
  expect(pending[0].signal.aborted).toBe(true);
  expect(pending[1].signal.aborted).toBe(true);
  await respond(2, ['latest']);
  await respond(1, ['older']);
  await respond(0, ['oldest']);
  expect(current.data).toEqual({ items: ['latest'] });
});

it('aborts on unmount and ignores completion without a React warning', async () => {
  const consoleError = vi.spyOn(console, 'error');
  await render();
  const before = current;
  await act(async () => root?.unmount());
  root = null;
  expect(pending[0].signal.aborted).toBe(true);
  await respond(0, ['late']);
  expect(current).toBe(before);
  expect(consoleError).not.toHaveBeenCalled();
});

it('survives StrictMode effect cleanup and remount', async () => {
  await act(async () =>
    root?.render(
      <StrictMode>
        <Probe url="/items" />
      </StrictMode>
    )
  );
  expect(pending).toHaveLength(2);
  expect(pending[0].signal.aborted).toBe(true);
  await respond(1, ['active']);
  await respond(0, ['discarded']);
  expect(current.data).toEqual({ items: ['active'] });
});

it('treats a 204 as a completed request with null data', async () => {
  await render();
  await act(async () => pending[0].resolve(new Response(null, { status: 204 })));
  expect(current).toMatchObject({ data: null, error: null, loading: false });
});
