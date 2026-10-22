import { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE, verifyToken } from '../libs/jwt';
import { AuthService } from '../services/authService';

const authService = new AuthService();

const NOT_LOGGED_IN = { error: 'You need to log in.' };

/**
 * Lets the request through only for a logged-in user, and puts that user
 * on `req.user` for the handlers after it. No cookie, a bad or expired
 * token, or a user who no longer exists → 401, and the handler never runs.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[AUTH_COOKIE];

        if (!token) {
            return res.status(401).json(NOT_LOGGED_IN);
        }

        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json(NOT_LOGGED_IN);
        }

        const user = await authService.findPublicUserById(userId);

        if (!user) {
            return res.status(401).json(NOT_LOGGED_IN);
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error checking login:', error);
        res.status(500).json({ error: 'Failed to check login' });
    }
};

