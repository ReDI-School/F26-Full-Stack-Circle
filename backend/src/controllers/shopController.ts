import type { Request, Response } from 'express';
import { ShopService } from '@/services/shopService';
import { getShopParamsSchema, getShopsQuerySchema } from '@/schemas/ShopSchema';

const shopService = new ShopService();

export class ShopController {
  async getShops(req: Request, res: Response) {
    const query = getShopsQuerySchema.parse(req.query);
    const shops = await shopService.getShops(query);
    res.json({ shops });
  }

  async getShopById(req: Request, res: Response) {
    const { id } = getShopParamsSchema.parse(req.params);
    const shop = await shopService.getShopById(id);
    res.json({ shop });
  }
}
