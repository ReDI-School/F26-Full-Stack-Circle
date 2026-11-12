import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { RequireAuth } from '../components/RequireAuth';

// ---------------------------------------------------------------------------
// Mock next/navigation
// ---------------------------------------------------------------------------

const mockReplace = vi.fn();
const mockPathname = vi.fn(() => '/account');

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn() }),
  usePathname: () => mockPathname(),
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

const userResponse = (overrides: { isAdmin?: boolean } = {}) =>
  Response.json({
    user: { name: 'Alice', email: 'a@b.com', isAdmin: false, ...overrides },
  });

const guestResponse = () => Response.json({ message: 'Unauthorized' }, { status: 401 });

const mount = async (props: { notice?: string; needAdminRights?: boolean } = {}) => {
  await act(async () =>
    root?.render(
      <AuthProvider>
        <RequireAuth {...props}>
          <p>protected content</p>
        </RequireAuth>
      </AuthProvider>
    )
  );
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
  mockReplace.mockReset();
  mockPathname.mockReturnValue('/account');
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

it('renders nothing while loading', async () => {
  await mount();
  // /me still in flight — loading=true
  expect(container.textContent).toBe('');
  expect(mockReplace).not.toHaveBeenCalled();
  // settle
  await respond(0, guestResponse());
});

it('redirects a guest to /login with next and notice params', async () => {
  mockPathname.mockReturnValue('/inbox');
  await mount({ notice: 'Log in to see your messages.' });
  await respond(0, guestResponse());
  expect(container.textContent).toBe('');
  expect(mockReplace).toHaveBeenCalledWith(
    '/login?next=%2Finbox&notice=Log+in+to+see+your+messages.'
  );
});

it('redirects a guest to /login with only the next param when no notice', async () => {
  mockPathname.mockReturnValue('/shop');
  await mount();
  await respond(0, guestResponse());
  expect(mockReplace).toHaveBeenCalledWith('/login?next=%2Fshop');
});

it('redirects a logged-in non-admin to / when needAdminRights is true', async () => {
  await mount({ needAdminRights: true });
  await respond(0, userResponse({ isAdmin: false }));
  expect(container.textContent).toBe('');
  expect(mockReplace).toHaveBeenCalledWith('/');
});

it('renders children for a logged-in user', async () => {
  await mount();
  await respond(0, userResponse());
  expect(container.textContent).toContain('protected content');
  expect(mockReplace).not.toHaveBeenCalled();
});

it('renders children for an admin when needAdminRights is true', async () => {
  await mount({ needAdminRights: true });
  await respond(0, userResponse({ isAdmin: true }));
  expect(container.textContent).toContain('protected content');
  expect(mockReplace).not.toHaveBeenCalled();
});
