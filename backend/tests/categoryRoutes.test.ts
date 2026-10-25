import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetAllCategories } = vi.hoisted(() => ({
  mockGetAllCategories: vi.fn(),
}));

vi.mock('@/services/categoryService', () => ({
  CategoryService: class {
    getAllCategories = mockGetAllCategories;
  },
}));

import categoryRouter from '../src/routes/categoryRoutes';

const app = express();
app.use(express.json());
app.use('/categories', categoryRouter);

describe('Category Routes - Response Codes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET /categories', () => {
    it('returns 200 when categories are fetched successfully', async () => {
      mockGetAllCategories.mockResolvedValue([
        {
          id: 'cat-1',
          slug: 'clothing',
          name: 'Clothing',
          emoji: '👕',
          tint: 1,
          _count: { items: 3 },
        },
      ]);

      const res = await request(app).get('/categories');

      expect(res.status).toBe(200);
    });

    it('returns 500 when category service throws an unexpected error', async () => {
      mockGetAllCategories.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/categories');

      expect(res.status).toBe(500);
    });
  });
});

describe('Category Routes - Response Messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET /categories', () => {
    it('returns the shaped categories array in the body on success', async () => {
      mockGetAllCategories.mockResolvedValue([
        {
          id: 'cat-1',
          slug: 'clothing',
          name: 'Clothing',
          emoji: '👕',
          tint: 1,
          _count: { items: 3 },
        },
      ]);

      const res = await request(app).get('/categories');

      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBe(true);
      expect(res.body.categories[0]).toMatchObject({ name: 'Clothing', slug: 'clothing' });
    });

    it('returns an empty categories array when there are no categories', async () => {
      mockGetAllCategories.mockResolvedValue([]);

      const res = await request(app).get('/categories');

      expect(res.body).toEqual({ categories: [] });
    });

    it('returns a generic error message when category service throws an unexpected error', async () => {
      mockGetAllCategories.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/categories');

      expect(res.body).toEqual({ error: 'Failed to fetch categories' });
    });
  });
  
});
