import { expect, it, vi } from 'vitest';
import { pushNext } from './navigation';

const makeRouter = () => ({ push: vi.fn() });
const makeSearchParams = (next: string | null) => ({
  get: (key: string) => (key === 'next' ? next : null),
});

it('pushes a valid same-origin path unchanged', () => {
  const router = makeRouter();
  pushNext(router as never, makeSearchParams('/account') as never);
  expect(router.push).toHaveBeenCalledWith('/account');
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
