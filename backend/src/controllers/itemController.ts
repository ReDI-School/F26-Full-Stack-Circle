import { Request, Response } from 'express';
import { ItemService } from '../services/itemService';
import {
  createItemSchema,
  getItemByIdResponseSchema,
  getItemByIdRequestSchema,
  getItemsQuerySchema,
} from '@/schemas/ItemSchema';
import { Prisma } from '@generated/prisma/client';
import { ZodError } from 'zod/v3';
import { ItemError } from '@/errors/itemError';

const itemService = new ItemService();

export class ItemController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    if (!req.user.shop) {
      return res.status(403).json({ error: 'You need a shop to list an item.' });
    }

    const parsed = createItemSchema.safeParse(req.body ?? {});
    const fields: Record<string, string> = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? 'body');
        fields[field] ??= issue.message;
      }
    }

    const category = createItemSchema.shape.categoryId.safeParse(req.body?.categoryId);

    try {
      // Check the category even when other fields fail, so one response can
      // show every field the seller needs to correct.
      if (category.success && !(await itemService.categoryExists(category.data))) {
        fields.categoryId = 'Category does not exist.';
      }

      if (!parsed.success || Object.keys(fields).length > 0) {
        return res.status(400).json({ error: 'Validation failed', fields });
      }

      const item = await itemService.create(req.user.shop.id, parsed.data);
      return res.status(201).json({ item: getItemByIdResponseSchema.parse(item) });
    } catch (error: unknown) {
      // A category can be removed between validation and the database write.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003' &&
        category.success &&
        !(await itemService.categoryExists(category.data))
      ) {
        return res.status(400).json({
          error: 'Validation failed',
          fields: { categoryId: 'Category does not exist.' },
        });
      }

      console.error('Error creating item:', error);
      return res.status(500).json({ error: 'Failed to create item' });
    }
  }

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

  async getById(req: Request, res: Response) {
    const params = getItemByIdRequestSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        error: 'Invalid item id: expected a UUID',
      });
    }

    try {
      const item = await itemService.getById(params.data.id);

      if (!item) {
        return res.status(404).json({
          error: 'Item not found',
        });
      }

      const validatedItem = getItemByIdResponseSchema.parse(item);

      return res.status(200).json({ item: validatedItem });
    } catch (error: unknown) {
      console.error('Error fetching item:', error);

      return res.status(500).json({
        error: 'Failed to fetch item',
      });
    }
  }
}
