import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AppShell } from '../components/AppShell';
import { AuthProvider } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';

const push = vi.fn();
const replace = vi.fn();
let pathname = '/';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
  usePathname: () => pathname,
}));
vi.mock('next/link', () => ({
  __esModule: true,
  default: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

type Pending = {
  path: string;
  resolve: (response: Response) => void;
  signal?: AbortSignal | null;
};
let pending: Pending[];
let container: HTMLDivElement;
let root: Root;

const SessionControls = () => {
  const { login, logout } = useAuth();
  return (
    <>
      <button onClick={() => login('alice@example.com', 'password')}>Test login</button>
      <button onClick={() => logout()}>Test logout</button>
    </>
  );
};
const render = async () => {
  await act(async () =>
    root.render(
      <AuthProvider>
        <AppShell>
          <SessionControls />
        </AppShell>
      </AuthProvider>
    )
  );
};
const requests = (path: string) => pending.filter((request) => request.path === path);
const respond = async (path: string, body: unknown, status = 200) => {
  const request = requests(path).at(-1);
  expect(request, `request to ${path}`).toBeDefined();
  await act(async () => request!.resolve(Response.json(body, { status })));
};
const click = async (text: string) => {
  const button = [...container.querySelectorAll('button')].find(
    (node) => node.textContent === text
  );
  expect(button, text).toBeDefined();
  await act(async () => button!.click());
};
const user = { id: 'alice', name: 'Alice', email: 'alice@example.com', isAdmin: false };

beforeEach(() => {
  pending = [];
  pathname = '/';
  push.mockReset();
  replace.mockReset();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (url: string, options: RequestInit) =>
        new Promise<Response>((resolve) => {
          pending.push({
            path: new URL(url, location.origin).pathname,
            resolve,
            signal: options.signal,
          });
        })
    )
  );
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('waits for the session before showing guest actions and never fetches a guest inbox', async () => {
  await render();
  // During loading, navbar exists but doesn't show guest actions
  const nav = container.querySelector('nav');
  expect(nav).not.toBeNull();
  expect(nav?.textContent).not.toContain('Log in');
  expect(nav?.textContent).not.toContain('Start selling');
  expect(requests('/api/threads')).toHaveLength(0);
  
  await respond('/api/auth/me', { error: 'Unauthorized' }, 401);
  const guestNav = container.querySelector('nav');
  expect(guestNav).not.toBeNull();
  expect(guestNav?.textContent).toContain('Log in');
  expect(requests('/api/threads')).toHaveLength(0);
});

it('wires the logo, add-item and inbox actions to their destinations', async () => {
  await render();
  await respond('/api/auth/me', { user });
  await act(async () => container.querySelector<HTMLButtonElement>('nav button')!.click());
  expect(push).toHaveBeenLastCalledWith('/');
  await click('+ Add item');
  expect(push).toHaveBeenLastCalledWith('/items/new');
  await act(async () =>
    container.querySelector<HTMLButtonElement>('[aria-label="Inbox"]')!.click()
  );
  expect(push).toHaveBeenLastCalledWith('/inbox');
});

it('loads unread messages after login, refreshes after reading, and drops them on logout', async () => {
  await render();
  await respond('/api/auth/me', { error: 'Unauthorized' }, 401);
  await click('Test login');
  await respond('/api/auth/login', { user });
  await respond('/api/threads', { threads: [], unreadCount: 3 });
  expect(container.querySelector('[aria-label="Inbox, 3 unread"]')).not.toBeNull();
  await act(async () => window.dispatchEvent(new Event('focus')));
  await respond('/api/threads', { threads: [], unreadCount: 0 });
  expect(container.querySelector('[aria-label="Inbox"]')).not.toBeNull();
  pathname = '/inbox';
  await render();
  expect(requests('/api/threads').length).toBeGreaterThanOrEqual(3);
  await click('Test logout');
  await respond('/api/auth/logout', {});
  expect(requests('/api/threads').at(-1)?.signal?.aborted).toBe(true);
  expect(container.querySelector('[aria-label^="Inbox"]')).toBeNull();
});

it.each(['/login', '/register'])('hides the navbar and footer on %s', async (path) => {
  pathname = path;
  await render();
  await respond('/api/auth/me', { error: 'Unauthorized' }, 401);
  expect(container.querySelector('nav, footer')).toBeNull();
});

it('keeps footer links usable when categories fail', async () => {
  await render();
  await respond('/api/categories', { error: 'Unavailable' }, 503);
  const footer = container.querySelector('footer')!;
  expect(footer.querySelector('a[href="/account"]')).not.toBeNull();
  expect(footer.querySelectorAll('a')).toHaveLength(7);
});

it('renders every returned category in API order, including zero-item categories', async () => {
  await render();
  await respond('/api/categories', {
    categories: [
      { id: 'one', name: 'New & Rare', slug: 'new & rare', itemCount: 0 },
      { id: 'two', name: 'Books', slug: 'books', itemCount: 2 },
    ],
  });
  const links = [...container.querySelectorAll<HTMLAnchorElement>('footer a[href^="/?category="]')];
  expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
    ['new & rare', '/?category=new%20%26%20rare'],
    ['books', '/?category=books'],
  ]);
});
