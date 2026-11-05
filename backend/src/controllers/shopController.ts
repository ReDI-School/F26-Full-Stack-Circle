import type { Request, Response } from 'express';
import { ShopService } from '@/services/shopService';
import { getShopParamsSchema, getShopsQuerySchema } from '@/schemas/ShopSchema';
import { ZodError } from 'zod/v3';

const shopService = new ShopService();

export class ShopController {
  async getShops(req: Request, res: Response) {
    try {
      const query = getShopsQuerySchema.parse(req.query);
      const shops = await shopService.getShops(query);
      return res.json({ shops });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      console.error('Error fetching shops:', error);
      return res.status(500).json({ error: 'Failed to fetch shops' });
    }
  }

  async getShopById(req: Request, res: Response) {
    const params = getShopParamsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({ error: ':id is not a valid UUID' });
    }

    try {
      const shop = await shopService.getShopById(params.data.id);

      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      return res.json({ shop });
    } catch (error: unknown) {
      console.error('Error fetching shop by id:', error);
      return res.status(500).json({ error: 'Failed to fetch shop' });
    }
  }
}
