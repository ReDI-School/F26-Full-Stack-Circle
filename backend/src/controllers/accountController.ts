import { Request, Response } from 'express';

import { AccountError } from '../errors/accountError';
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS } from '../libs/jwt';
import { updateAccountSchema } from '../schemas/AccountSchema';
import { AccountService } from '../services/accountService';

const accountService = new AccountService();

export class AccountController {
  /**
   * Shared by `GET /api/me` and `GET /api/auth/me`. requireAuth has
   * already loaded the public user (no passwordHash) onto `req.user`.
   */
  getMe(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    return res.status(200).json({ user: req.user });
  }

  async updateMe(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    const parsed = updateAccountSchema.safeParse(req.body ?? {});

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message ?? 'Validation failed',
        details: parsed.error.issues,
      });
    }

    try {
      const user = await accountService.update(req.user.id, parsed.data);

      return res.status(200).json({ user });
    } catch (error) {
      if (error instanceof AccountError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error('Error updating account:', error);
      return res.status(500).json({ error: 'Failed to update account' });
    }
  }

  async deleteMe(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'You need to log in.' });
    }

    try {
      await accountService.delete(req.user.id);
      res.clearCookie(AUTH_COOKIE, AUTH_COOKIE_OPTIONS);
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting account:', error);
      return res.status(500).json({ error: 'Failed to delete account' });
    }
  }
}
