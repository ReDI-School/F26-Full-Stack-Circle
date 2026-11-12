import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import Login from './page';

// ---------------------------------------------------------------------------
// Mock next/navigation
// ---------------------------------------------------------------------------

const mockPush = vi.fn();
let mockSearchParams: Record<string, string> = {};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams[key] ?? null,
  }),
  usePathname: () => '/',
}));

// ---------------------------------------------------------------------------
// Infrastructure
// ---------------------------------------------------------------------------

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

/** Mount the Login page inside AuthProvider and wait for it to be ready. */
const setup = async (searchParams: Record<string, string> = {}) => {
  mockSearchParams = searchParams;
  mockPush.mockReset();

  if (root) {
    await act(async () => root!.unmount());
    container.remove();
  }
  pending = [];

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);

  await act(async () =>
    root!.render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
  );
  // Settle the /auth/me mount call as a 401 (guest)
  await respond(0, Response.json({ message: 'Unauthorized' }, { status: 401 }));
};

const clickLogin = async () => {
  const btn = container.querySelector<HTMLButtonElement>('button');
  expect(btn).not.toBeNull();
  await act(async () => btn!.click());
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
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  if (root) {
    await act(async () => root!.unmount());
    root = null;
  }
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

it('redirects to / when no ?next is present', async () => {
  await setup();
  await clickLogin();
  // pending[1] is the POST /auth/login
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(mockPush).toHaveBeenCalledWith('/');
});

it('redirects to ?next path after a successful login', async () => {
  await setup({ next: '/account' });
  await clickLogin();
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(mockPush).toHaveBeenCalledWith('/account');
});

it('sanitises a protocol-relative ?next to /', async () => {
  await setup({ next: '//evil.com' });
  await clickLogin();
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(mockPush).toHaveBeenCalledWith('/');
});

it('sanitises a backslash bypass in ?next to /', async () => {
  await setup({ next: '/\\evil.com' });
  await clickLogin();
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(mockPush).toHaveBeenCalledWith('/');
});

it('sanitises an absolute URL in ?next to /', async () => {
  await setup({ next: 'https://evil.example/steal' });
  await clickLogin();
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(mockPush).toHaveBeenCalledWith('/');
});
