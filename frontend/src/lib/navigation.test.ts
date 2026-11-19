import { expect, it, vi } from 'vitest';
import { pushNext, sanitizeNextPath } from './navigation';

const makeRouter = () => ({ push: vi.fn() });
const makeSearchParams = (next: string | null) => ({
  get: (key: string) => (key === 'next' ? next : null),
});

it('pushes a valid same-origin path unchanged', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('/account') as never);
  expect(router.push).toHaveBeenCalledWith('/account');
});

it('preserves query params and hash on valid relative paths', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('/shop?category=shoes&sort=asc#results') as never);
  expect(router.push).toHaveBeenCalledWith('/shop?category=shoes&sort=asc#results');
});

it('pushes / when ?next is absent (null)', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams(null) as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for an empty string', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for a protocol-relative URL (//evil.com)', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('//evil.com') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for a backslash bypass (/\\evil.com)', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('/\\evil.com') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for backslashes anywhere in path (/path\\to\\somewhere)', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('/path\\to\\somewhere') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for dummy host collision attempts (//n/steal or /\\n/steal)', () => {
  const router1 = makeRouter();
  pushNext(router1 as never, makeSearchParams('//n/steal') as never);
  expect(router1.push).toHaveBeenCalledWith('/');

  const router2 = makeRouter();
  pushNext(router2 as never, makeSearchParams('/\\n/steal') as never);
  expect(router2.push).toHaveBeenCalledWith('/');

  const router3 = makeRouter();
  pushNext(router3 as never, makeSearchParams('//localhost/steal') as never);
  expect(router3.push).toHaveBeenCalledWith('/');
});

it('pushes / for multi-slash bypasses (///evil.com)', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('///evil.com') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for an absolute https URL', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('https://evil.example/steal') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for an absolute http URL', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('http://evil.example') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('pushes / for a javascript: URL', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('javascript:alert(1)') as never);
  expect(router.push).toHaveBeenCalledWith('/');
});

it('sanitizeNextPath directly returns / for invalid or non-string inputs', () => {
  expect(sanitizeNextPath(undefined)).toBe('/');
  expect(sanitizeNextPath(null)).toBe('/');
  expect(sanitizeNextPath('')).toBe('/');
  expect(sanitizeNextPath('not-a-path')).toBe('/');
});
