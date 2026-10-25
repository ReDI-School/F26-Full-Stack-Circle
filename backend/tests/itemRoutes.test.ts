import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetItems } = vi.hoisted(() => ({
  mockGetItems: vi.fn(),
}));

vi.mock('@/services/itemService', () => ({
  ItemService: class {
    getItems = mockGetItems;
  },
}));

import itemRouter from '@/routes/itemRoutes';
import { ItemError } from '@/errors/itemError';

const app = express();
app.use(express.json());
app.use('/items', itemRouter);

describe('Item Routes - Response Codes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET /items', () => {
    it('returns 200 when items are fetched successfully without query parameters', async () => {
      mockGetItems.mockResolvedValue({ items: [], total: 0 });

      const res = await request(app).get('/items');

      expect(res.status).toBe(200);
    });

    it('returns 200 when items are fetched successfully with valid query parameters', async () => {
      mockGetItems.mockResolvedValue({ items: [], total: 0 });

      const res = await request(app).get('/items?take=10&skip=5&category=electronics');

      expect(res.status).toBe(200);
    });

    it('returns 400 when query parameter take is invalid', async () => {
      const res = await request(app).get('/items?take=-1');

      expect(res.status).toBe(400);
    });

    it('returns 400 when query parameter take exceeds maximum', async () => {
      const res = await request(app).get('/items?take=999');

      expect(res.status).toBe(400);
    });

    it('returns 400 when query parameter skip is negative', async () => {
      const res = await request(app).get('/items?skip=-10');

      expect(res.status).toBe(400);
    });

    it('returns the status code specified by ItemError (e.g. 404)', async () => {
      mockGetItems.mockRejectedValue(new ItemError(404, 'Category not found'));

      const res = await request(app).get('/items?category=unknown');

      expect(res.status).toBe(404);
    });

    it('returns 500 when item service throws an unexpected error', async () => {
      mockGetItems.mockRejectedValue(new Error('Unexpected error'));

      const res = await request(app).get('/items');

      expect(res.status).toBe(500);
    });
  });
});

