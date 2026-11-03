import { NextFunction, Request, Response } from 'express';

/**
 * Must run after requireAuth. A logged-in user who isn't an admin gets 403.
 */

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admins only.' });
  }
  next();
};
