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
}
