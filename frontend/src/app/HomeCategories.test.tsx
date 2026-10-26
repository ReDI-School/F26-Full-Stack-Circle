import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import HomeCategories from './HomeCategories';
import { ToastProvider } from '../components/ToastProvider';

let root: Root;
let container: HTMLDivElement;
let responses: ((response: Response) => void)[];
const categories = [{ id: 'books', name: 'Books', emoji: '📚', tint: 1, itemCount: 3 }];
const reply = async (index: number, response: Response) => {
  await act(async () => responses[index](response));
};
const click = async (label: string) => {
  const button = [...container.querySelectorAll('button')].find(
    (item) => item.textContent === label
  );
  expect(button).toBeDefined();
  await act(async () => button?.click());
};
const notification = () => document.body.querySelector(':scope > [role="status"]');

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  responses = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise<Response>((resolve) => responses.push(resolve)))
  );
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <ToastProvider>
        <HomeCategories />
      </ToastProvider>
    )
  );
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

it('shows a skeleton, loads real-shaped categories, then notifies after an explicit refresh', async () => {
  expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  await reply(0, Response.json({ categories }));
  expect(container.textContent).toContain('Books');
  expect(container.textContent).toContain('3 items');
  expect(notification()).toBeNull();
  await click('Refresh categories');
  expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  await reply(1, Response.json({ categories }));
  expect(notification()?.textContent).toContain('Categories updated.');
});

it('keeps a retryable inline error and shows an error toast after a failed retry', async () => {
  await reply(0, Response.json({ error: 'Database unavailable' }, { status: 500 }));
  expect(container.querySelector('[role="alert"]')?.textContent).toContain('Please try again');
  await click('Try again');
  await reply(1, Response.json({ error: 'Database unavailable' }, { status: 500 }));
  expect(notification()?.getAttribute('aria-live')).toBe('assertive');
  await click('Try again');
  await reply(2, Response.json({ categories }));
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(notification()?.textContent).toContain('Categories updated.');
});

it('shows an empty message for a successful empty result', async () => {
  await reply(0, Response.json({ categories: [] }));
  expect(container.textContent).toContain('No categories are available yet.');
  expect(container.querySelector('[role="alert"]')).toBeNull();
});
