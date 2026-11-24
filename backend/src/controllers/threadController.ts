import { Request, Response } from 'express';
import { z } from 'zod';

import { ThreadError } from '@/errors/threadError';
import { getItemByIdRequestSchema } from '@/schemas/ItemSchema';
import { ThreadService } from '../services/threadService';

const threadService = new ThreadService();

/**
 * A reply: trimmed at both ends, then 1 to 2000 characters. Newlines inside
 * the message are kept, and nothing is HTML-escaped.
 */
const sendMessageSchema = z.object({
  body: z
    .string({ error: 'Message is required.' })
    .trim()
    .min(1, "Message can't be empty.")
    .max(2000, 'Message is too long (max 2000 characters).'),
});

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

  /** POST /api/threads/:id/messages { body } → 201 { message } */
  async sendMessage(req: Request, res: Response) {
    const params = getItemByIdRequestSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({ error: 'Invalid thread id: expected a UUID' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    // Empty, whitespace-only or over 2000 characters → 400
    const parsed = sendMessageSchema.safeParse(req.body ?? {});

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message ?? 'Validation failed',
        details: parsed.error.issues,
      });
    }

    try {
      const message = await threadService.sendMessage(
        params.data.id,
        req.user.id,
        parsed.data.body
      );

      return res.status(201).json({ message });
    } catch (error) {
      // 404 no such thread, 403 someone else's thread
      if (error instanceof ThreadError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error('Error sending message:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  }

  /** POST /api/threads/:id/read → 204, also when there was nothing to mark */
  async markRead(req: Request, res: Response) {
    const params = getItemByIdRequestSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({ error: 'Invalid thread id: expected a UUID' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    try {
      await threadService.markRead(params.data.id, req.user.id);

      return res.status(204).end();
    } catch (error) {
      // 404 no such thread, 403 someone else's thread
      if (error instanceof ThreadError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error('Error marking thread as read:', error);
      return res.status(500).json({ error: 'Failed to mark conversation as read' });
    }
  }
}
