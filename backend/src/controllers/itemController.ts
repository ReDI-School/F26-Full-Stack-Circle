import type { Request, Response } from 'express';
import { ItemService } from '../services/itemService';
import { getItemsQuerySchema } from '@/schemas/ItemSchema';

const itemService = new ItemService();

export class ItemController {
  async getItems(req: Request, res: Response) {
    const queryParams = getItemsQuerySchema.parse(req.query);
    const result = await itemService.getItems(queryParams);
    res.json(result);
  }
}
