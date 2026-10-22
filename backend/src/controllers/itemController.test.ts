import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

// Same trick as in authService.test.ts: replace the database module. Here
// the service should never reach it, because validation stops the request.
vi.mock('../libs/prisma', () => ({
  default: {
    item: { findMany: vi.fn(), count: vi.fn() },
    category: { findUnique: vi.fn() },
  },
}));

import prisma from '../libs/prisma';
import { ItemController } from './itemController';

const fakeRes = () => {
  const res = { status: vi.fn(() => res), json: vi.fn(() => res) };
  return res;
};

describe('GET /api/items', () => {
  // `it.fails` because this is a known bug: the controller imports ZodError
  // from 'zod/v3' while the schema is built with Zod 4, so `instanceof`
  // is false and bad input gets a 500. Once the import is fixed, this test
  // starts failing as a reminder to change `it.fails` back to `it`.
  it.fails('answers 400 when take is above 100', async () => {
    const res = fakeRes();

    await new ItemController().getItems(
      { query: { take: '500' } } as unknown as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.item.findMany).not.toHaveBeenCalled();
  });
});
