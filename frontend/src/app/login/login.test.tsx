import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  searchParams: {} as Record<string, string>,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
  useSearchParams: () => ({
    get: (key: string) => mocks.searchParams[key] ?? null,
  }),
}));

vi.mock('../../components', () => ({
  Button: ({
    children,
    stretch: _stretch,
    ...props
  }: React.ComponentProps<'button'> & {
    stretch?: boolean;
  }) => {
    void _stretch;
    return React.createElement('button', props, children);
  },
  TextField: ({ label, ...props }: React.ComponentProps<'input'> & { label: string }) =>
    React.createElement('label', null, label, React.createElement('input', props)),
}));

import LoginForm from './LoginForm';

type Pending = {
  resolve: (response: Response) => void;
  reject: (reason: unknown) => void;
};

let container: HTMLDivElement;
let root: Root | null;
let pending: Pending[];

const respond = async (index: number, response: Response) => {
  await act(async () => pending[index].resolve(response));
};

const setInputValue = async (name: string, value: string) => {
  await act(async () => {
    const input = container.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    expect(input).not.toBeNull();

    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, value);
    input?.dispatchEvent(new Event('input', { bubbles: true }));
    input?.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

const setup = async (searchParams: Record<string, string> = {}) => {
  mocks.searchParams = searchParams;
  mocks.replace.mockReset();
  mocks.refresh.mockReset();
  pending = [];

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);

  await act(async () => root?.render(<LoginForm />));
};

const submitLogin = async () => {
  await setInputValue('email', 'lena@redi-school.org');
  await setInputValue('password', 'redicycle123');

  const button = container.querySelector<HTMLButtonElement>('button[type="submit"]');
  expect(button).not.toBeNull();
  await act(async () => button?.click());
};

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  pending = [];
  root = null;
  vi.stubGlobal(
    'fetch',
    vi.fn(
      () =>
        new Promise<Response>((resolve, reject) => {
          pending.push({ resolve, reject });
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

it('renders the notice and both navigation links', async () => {
  await setup({ notice: 'Log in to see your messages' });

  expect(container.textContent).toContain('Log in to see your messages');
  expect(container.querySelector('a[href="/register"]')).not.toBeNull();
  expect(container.querySelector('a[href="/"]')).not.toBeNull();
});

it('redirects to / when no ?next is present', async () => {
  await setup();
  await submitLogin();
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/');
  expect(mocks.refresh).toHaveBeenCalled();
});

it('redirects to ?next path after successful login', async () => {
  await setup({ next: '/inbox' });
  await submitLogin();
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/inbox');
});

it('sanitises a protocol-relative ?next to /', async () => {
  await setup({ next: '//evil.com' });
  await submitLogin();
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/');
});

it('sanitises a backslash bypass in ?next to /', async () => {
  await setup({ next: '/\\evil.com' });
  await submitLogin();
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/');
});

it('sanitises an absolute URL in ?next to /', async () => {
  await setup({ next: 'https://example.com' });
  await submitLogin();
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com' } }));

  expect(mocks.replace).toHaveBeenCalledWith('/');
});

it('shows the generic credentials error and allows retry', async () => {
  await setup();
  await submitLogin();

  expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  await respond(0, Response.json({ error: 'Wrong email or password.' }, { status: 401 }));

  expect(container.querySelector('[role="alert"]')?.textContent).toBe('Wrong email or password.');
  expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);
  expect(mocks.replace).not.toHaveBeenCalled();

  await submitLogin();
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com' } }));
  expect(mocks.replace).toHaveBeenCalledWith('/');
});

it('shows a useful network error instead of failing silently', async () => {
  await setup();
  await submitLogin();
  await act(async () => pending[0].reject(new TypeError('Failed to fetch')));

  expect(container.querySelector('[role="alert"]')?.textContent).toContain('Please try again');
  expect(mocks.replace).not.toHaveBeenCalled();
});
