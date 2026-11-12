import React, { act, useLayoutEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import useAuth from './useAuth';

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
let current: ReturnType<typeof useAuth>;

const Probe = () => {
  const ctx = useAuth();
  useLayoutEffect(() => {
    current = ctx;
  });
  return null;
};

const mount = async () => {
  await act(async () =>
    root?.render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )
  );
};

const respond = async (index: number, response: Response) => {
  await act(async () => pending[index].resolve(response));
};

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  pending = [];
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
  await mount();
});

afterEach(async () => {
  await act(async () => root?.unmount());
  root = null;
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// /auth/me on mount
// ---------------------------------------------------------------------------

it('starts loading while /me is in flight', async () => {
  expect(current.loading).toBe(true);
  expect(current.user).toBeNull();
});

it('sets user when /me returns 200', async () => {
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(current.loading).toBe(false);
  expect(current.user).toEqual({ name: 'Alice', email: 'a@b.com', isAdmin: false });
});

it('treats a 401 as guest: no user, no console error', async () => {
  const consoleError = vi.spyOn(console, 'error');
  await respond(0, Response.json({ message: 'Unauthorized' }, { status: 401 }));
  expect(current.loading).toBe(false);
  expect(current.user).toBeNull();
  expect(consoleError).not.toHaveBeenCalled();
});

it('treats a non-401 error as guest but logs it to console', async () => {
  const consoleError = vi.spyOn(console, 'error');
  await respond(0, Response.json({ message: 'Service unavailable' }, { status: 503 }));
  expect(current.loading).toBe(false);
  expect(current.user).toBeNull();
  expect(consoleError).toHaveBeenCalledOnce();
});

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

it('login sets user from response body without a second /me call', async () => {
  // Finish the mount /me first (401 = guest)
  await respond(0, Response.json({ message: 'Unauthorized' }, { status: 401 }));
  expect(current.user).toBeNull();

  let loginPromise: Promise<void>;
  await act(async () => {
    loginPromise = current.login('a@b.com', 'pass');
  });
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  await act(async () => {
    await loginPromise;
  });

  expect(current.user).toEqual({ name: 'Alice', email: 'a@b.com', isAdmin: false });
  // Only 2 fetches total — no extra /me
  expect(pending).toHaveLength(2);
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

it('logout clears user even when the POST fails', async () => {
  // Set up logged-in state
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  expect(current.user).not.toBeNull();

  let logoutPromise: Promise<void>;
  await act(async () => {
    logoutPromise = current.logout();
  });
  // Make the logout POST fail
  await act(async () => pending[1].reject(new Error('Network error')));
  await act(async () => {
    await logoutPromise;
  });

  expect(current.user).toBeNull();
});

// ---------------------------------------------------------------------------
// refresh
// ---------------------------------------------------------------------------

it('refresh re-fetches /me and updates user', async () => {
  // Start as guest
  await respond(0, Response.json({ message: 'Unauthorized' }, { status: 401 }));
  expect(current.user).toBeNull();

  let refreshPromise: Promise<void>;
  await act(async () => {
    refreshPromise = current.refresh();
  });
  // refresh must NOT set loading to true (avoids unmounting protected pages)
  expect(current.loading).toBe(false);
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  await act(async () => {
    await refreshPromise;
  });

  expect(current.loading).toBe(false);
  expect(current.user).toEqual({ name: 'Alice', email: 'a@b.com', isAdmin: false });
});

it('provides stable function references across re-renders', async () => {
  await respond(0, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  const { login, register, logout, refresh } = current;

  // Trigger a refresh to re-render with updated state
  let refreshPromise: Promise<void>;
  await act(async () => {
    refreshPromise = current.refresh();
  });
  await respond(1, Response.json({ user: { name: 'Alice', email: 'a@b.com', isAdmin: false } }));
  await act(async () => {
    await refreshPromise;
  });

  expect(current.login).toBe(login);
  expect(current.register).toBe(register);
  expect(current.logout).toBe(logout);
  expect(current.refresh).toBe(refresh);
});
