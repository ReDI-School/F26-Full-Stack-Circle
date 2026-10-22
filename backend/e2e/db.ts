import { PrismaPg } from '@prisma/adapter-pg';
import { inject } from 'vitest';

import { PrismaClient } from '../generated/prisma/client';

// Direct access to the e2e database, for arranging data the API cannot
// create (like rows written by older code) and for checking what was saved.
export const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: inject('databaseUrl') }),
});

export const api = (path: string, init?: Parameters<typeof fetch>[1]) =>
  fetch(`${inject('apiUrl')}${path}`, init);

export const register = (body: { name: string; email: string; password: string }) =>
  api('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
