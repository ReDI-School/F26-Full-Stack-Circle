import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  searchParams: {} as Record<string, string>,
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
  useSearchParams: () => ({
    get: (key: string) => mocks.searchParams[key] ?? null,
  }),
}));

import LoginPage from './page';

type PendingRequest = {
  resolve: (response: Response) => void;
  reject: (reason: unknown) => void;
};

let container: HTMLDivElement;
let root: Root | null;
let pendingRequests: PendingRequest[];

const respond = async (index: number, response: Response) => {
  await act(async () => pendingRequests[index].resolve(response));
};

const setup = async (searchParams: Record<string, string> = {}) => {
  mocks.searchParams = searchParams;
  mocks.replace.mockReset();
  mocks.refresh.mockReset();
  pendingRequests = [];

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);

  await act(async () => root?.render(<LoginPage />));
};

const fillField = async (name: string, value: string) => {
  await act(async () => {
    const input = container.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!input) throw new Error(`Could not find ${name} input`);

    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setValue?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const submitLogin = async () => {
  await fillField('email', 'lena@redi-school.org');
  await fillField('password', 'redicycle123');

  const button = container.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!button) throw new Error('Could not find login button');

  await act(async () => button.click());
};

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  pendingRequests = [];
  root = null;
  vi.stubGlobal(
    'fetch',
    vi.fn(
      () =>
        new Promise<Response>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
    )
  );
});

afterEach(async () => {
  if (root) {
    await act(async () => root?.unmount());
    root = null;
  }
  container?.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('shows the notice and both navigation links', async () => {
  await setup({ notice: 'Log in to see your messages' });

  expect(container.textContent).toContain('Log in to see your messages');
  expect(container.querySelector('a[href="/register"]')).not.toBeNull();
  expect(container.querySelector('a[href="/"]')).not.toBeNull();
});

it('redirects to the requested internal page after successful login', async () => {
  await setup({ next: '/inbox' });
  await submitLogin();
  await respond(0, Response.json({ user: { id: '1' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/inbox');
  expect(mocks.refresh).toHaveBeenCalled();
});

it('falls back to the home page for an external redirect', async () => {
  await setup({ next: 'https://example.com' });
  await submitLogin();
  await respond(0, Response.json({ user: { id: '1' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/');
});

it('shows the generic credentials error for a 401 response', async () => {
  await setup();
  await submitLogin();
  await respond(0, Response.json({ error: 'Wrong email or password.' }, { status: 401 }));

  expect(container.querySelector('[role="alert"]')?.textContent).toBe('Wrong email or password.');
  expect(mocks.replace).not.toHaveBeenCalled();
});

it('disables the submit button while the request is pending', async () => {
  await setup();
  await submitLogin();

  expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);

  await respond(0, Response.json({ error: 'Wrong email or password.' }, { status: 401 }));
  expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);
});
