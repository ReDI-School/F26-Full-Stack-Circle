import { expect, it } from 'vitest';

import { api } from './db';

// Ticket #39: "Returns all five categories in a stable order", the order
// of the seed. A mocked test can't check this: the order comes from the
// ORDER BY that PostgreSQL runs, and a mock returns whatever you tell it.
//
// `it.fails` because this is a known bug: ids became UUIDs in #79, so
// `orderBy: id` no longer means seed order. Once it is fixed, this test
// starts failing as a reminder to change `it.fails` back to `it`.
it.fails('GET /api/categories returns the categories in seed order', async () => {
  const res = await api('/categories');
  const { categories } = await res.json();

  expect(res.status).toBe(200);
  expect(categories.map((c: { slug: string }) => c.slug)).toEqual([
    'clothing',
    'books',
    'electronics',
    'home',
    'sports',
  ]);
});
