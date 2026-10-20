import { Request, Response } from 'express';
import { ItemService } from '../services/itemService';

const itemService = new ItemService();

export class ItemController {
  async getItems(req: Request, res: Response) {
    try {
      const result = await itemService.getItems({
        category: typeof req.query.category === 'string' ? req.query.category : undefined,
        q: typeof req.query.q === 'string' ? req.query.q : undefined,
        shopId: typeof req.query.shopId === 'string' ? req.query.shopId : undefined,
        take: req.query.take ? Number(req.query.take) : undefined,
        skip: req.query.skip ? Number(req.query.skip) : undefined,
      });

      res.json(result);
    } catch (error: unknown) {
      console.error('Error fetching items:', error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
  }
}
