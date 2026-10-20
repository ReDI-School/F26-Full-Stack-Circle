import { Request, Response } from 'express';
import { ItemService } from '../services/itemService';
import { getItemsQuerySchema } from '@/schemas/ItemSchema';
import { ZodError } from 'zod/v3';
import { ItemError } from '@/errors/itemError';

const itemService = new ItemService();

export class ItemController {
  async getItems(req: Request, res: Response) {
    try {
      const queryParams = getItemsQuerySchema.parse(req.query);
      const result = await itemService.getItems(queryParams);
      return res.json(result);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      if (error instanceof ItemError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Unexpected error fetching items:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
  }
}
