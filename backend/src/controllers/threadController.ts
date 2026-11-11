import { Request, Response } from 'express';

import { ThreadError } from '@/errors/threadError';
import { getItemByIdRequestSchema } from '@/schemas/ItemSchema';
import { ThreadService } from '../services/threadService';

const threadService = new ThreadService();

export class ThreadController {
  async expressInterest(req: Request, res: Response) {
    // Check that the id in the URL is a UUID
    const params = getItemByIdRequestSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({ error: 'Invalid item id: expected a UUID' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    try {
      // Call the service: item id from the URL, buyer id from the token
      const { thread, created } = await threadService.expressInterest(params.data.id, req.user.id);

      // 201 if created, 200 if it already existed
      return res.status(created ? 201 : 200).json({ thread });
    } catch (error) {
      if (error instanceof ThreadError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error('Error expressing interest:', error);
      return res.status(500).json({ error: 'Failed to express interest' });
    }
  }

  /** GET /api/threads → { threads, unreadCount } */
  async list(req: Request, res: Response) {
    // requireAuth runs first and sets req.user; this keeps the types honest.
    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    try {
      const { threads, unreadCount } = await threadService.listForUser(req.user.id);

      return res.json({ threads, unreadCount });
    } catch (error) {
      console.error('Error listing threads:', error);
      return res.status(500).json({ error: 'Failed to load conversations' });
    }
  }

  /** GET /api/threads/:id → { thread } with its messages */
  async getById(req: Request, res: Response) {
    // Check that the id in the URL is a UUID (same { id } check as expressInterest)
    const params = getItemByIdRequestSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({ error: 'Invalid thread id: expected a UUID' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    try {
      const thread = await threadService.getById(params.data.id, req.user.id);

      return res.json({ thread });
    } catch (error) {
      // 404 no such thread, 403 someone else's thread
      if (error instanceof ThreadError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error('Error loading thread:', error);
      return res.status(500).json({ error: 'Failed to load conversation' });
    }
  }
}
