import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

const { mockGetShopById } = vi.hoisted(() => ({
  mockGetShopById: vi.fn(),
}));

vi.mock('@/services/shopService', () => ({
  ShopService: class {
    getShopById = mockGetShopById;
  },
}));

import shopRoutes from '@/routes/shopRoutes';
import { errorHandler } from '@/shared/middleware/error-handler';
import { NotFoundError } from '@/shared/errors';

const app = express();
app.use(express.json());
app.use('/shops', shopRoutes);
app.use(errorHandler);
describe('GET /shops/:id', () => {
  it('returns 200 when shop is fetched successfully', async () => {
    mockGetShopById.mockResolvedValue({
      id: 'ed2d508a-a212-4421-94ca-dd36b7897ca2',
      name: 'Test Shop',
    });

    const res = await request(app).get('/shops/ed2d508a-a212-4421-94ca-dd36b7897ca2');

    expect(res.status).toBe(200);
    expect(res.body.shop).toHaveProperty('id');
  });

  it('returns 400 when shop id format is invalid (e.g. not a valid UUID if validated by Zod)', async () => {
    const res = await request(app).get('/shops/1');

    expect(res.status).toBe(400);
  });
  it('returns 404 when shop does not exist in database', async () => {
    mockGetShopById.mockRejectedValue(
      new NotFoundError('Shop', 'ed2d508a-a212-4421-94ca-dd36b7897ca2')
    );

    const res = await request(app).get('/shops/ed2d508a-a212-4421-94ca-dd36b7897ca2');

    expect(res.status).toBe(404);
  });
});
