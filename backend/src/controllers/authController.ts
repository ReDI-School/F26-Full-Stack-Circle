import { Request, Response } from 'express';

import { TOKEN_TTL_SECONDS, signToken } from '../libs/jwt';
import { AuthError, AuthService } from '../services/authService';

const authService = new AuthService();

/**
 * The token goes in a cookie the browser cannot read from JavaScript, so
 * an XSS bug cannot steal a login. The browser sends it on every request
 * on its own, which means the frontend never touches a token at all.
 */
const AUTH_COOKIE = 'token';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  // Only over HTTPS once deployed, so it still works on http://localhost.
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: TOKEN_TTL_SECONDS * 1000,
};

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body ?? {});

      res.cookie(AUTH_COOKIE, signToken(user.id), cookieOptions);

      res.status(201).json({ user });
    } catch (error) {
      // Everything the service rejects on purpose carries the status and a
      // message meant for a person to read.
      if (error instanceof AuthError) {
        return res.status(error.status).json({ error: error.message });
      }

      console.error('Error registering user:', error);

      res.status(500).json({ error: 'Failed to register' });
    }
  }
}
