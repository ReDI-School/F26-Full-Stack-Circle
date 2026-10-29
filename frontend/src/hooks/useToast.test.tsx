import React, { act, useLayoutEffect, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ToastProvider } from '../components/ToastProvider';
import useToast, { type ToastApi } from './useToast';

let root: Root | null;
let container: HTMLDivElement;
let toast: ToastApi;

const Probe = () => {
  const api = useToast();
  useLayoutEffect(() => {
    toast = api;
  });
  return <button onClick={() => api.success('Saved')}>Save</button>;
};
const notification = () => document.querySelector('[role="status"]');
const advance = async (ms: number) => {
  await act(async () => vi.advanceTimersByTime(ms));
};
const mount = async () => {
  await act(async () =>
    root?.render(
      <StrictMode>
        <ToastProvider>
          <Probe />
        </ToastProvider>
      </StrictMode>
    )
  );
};

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await mount();
});

afterEach(async () => {
  await act(async () => root?.unmount());
  root = null;
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('renders a success in a body portal and dismisses at exactly 3.2 seconds', async () => {
  expect(notification()).toBeNull();
  await act(async () => toast.success('Saved'));
  expect(notification()?.textContent).toContain('Saved');
  expect(notification()?.parentElement).toBe(document.body);
  expect(notification()?.getAttribute('aria-live')).toBe('polite');
  expect(vi.getTimerCount()).toBe(1);
  await advance(3199);
  expect(notification()).not.toBeNull();
  await advance(1);
  expect(notification()).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
});

it('replaces a success with one error and gives it a fresh lifetime', async () => {
  await act(async () => toast.success('First'));
  await advance(3000);
  await act(async () => toast.error('Second'));
  expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
  expect(notification()?.textContent).toContain('Second');
  expect(notification()?.getAttribute('aria-live')).toBe('assertive');
  await advance(200);
  expect(notification()?.textContent).toContain('Second');
  await advance(3000);
  expect(notification()).toBeNull();
});

it('resets the timer even when the same message is shown again', async () => {
  await act(async () => toast.success('Saved'));
  await advance(3000);
  await act(async () => toast.success('Saved'));
  await advance(3199);
  expect(notification()).not.toBeNull();
  await advance(1);
  expect(notification()).toBeNull();
});

it('manual dismissal clears the timer and does not affect the next notification', async () => {
  await act(async () => toast.success('First'));
  await advance(1000);
  await act(async () =>
    document.querySelector<HTMLButtonElement>('[aria-label="Dismiss notification"]')?.click()
  );
  expect(notification()).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
  await act(async () => toast.error('Second'));
  await advance(2200);
  expect(notification()?.textContent).toContain('Second');
});

it('keeps the API stable and does not restart the timer on unrelated renders', async () => {
  const original = toast;
  await act(async () => toast.success('Saved'));
  await advance(2000);
  await mount();
  expect(toast).toBe(original);
  await advance(1200);
  expect(notification()).toBeNull();
});

it('removes the portal and timer when the provider unmounts', async () => {
  await act(async () => toast.success('Saved'));
  await act(async () => root?.unmount());
  root = null;
  expect(notification()).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
  await advance(4000);
  expect(notification()).toBeNull();
});
