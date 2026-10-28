import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/AuthSchema';

import { EmailAlreadyRegisteredError } from '@/errors/authErrors';
import { TOKEN_TTL_SECONDS, signToken } from '../libs/jwt';
import { AuthService } from '../services/authService';

const authService = new AuthService();

/**
 * The shape of a valid registration request. `trim` and `toLowerCase` are
 * transforms, not just checks, so the service receives the cleaned values -
 * which is what makes Ada@... and ada@... the same account.
 */

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
    const parsed = registerSchema.safeParse(req.body ?? {});

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message ?? 'Validation failed',
        details: parsed.error.issues,
      });
    }

    try {
      const user = await authService.register(parsed.data);

      res.cookie(AUTH_COOKIE, signToken(user.id), cookieOptions);

      res.status(201).json({ user });
    } catch (error) {
      // Mapping domain errors to HTTP status codes happens here, at the
      // transport boundary, not in the service.
      if (error instanceof EmailAlreadyRegisteredError) {
        return res.status(409).json({ error: error.message });
      }

      console.error('Error registering user:', error);

      res.status(500).json({ error: 'Failed to register' });
    }
  }

  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body ?? {});

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message ?? 'Validation failed',
        details: parsed.error.issues,
      });
    }

    try {
      const user = await authService.login(parsed.data);
      if (!user) {
        return res.status(401).json({ error: 'Wrong email or password.' });
      }

      res.cookie(AUTH_COOKIE, signToken(user.id), cookieOptions);

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error logging in:', error);

      res.status(500).json({ error: 'Failed to log in' });
    }
  }

  logout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE, cookieOptions);
    return res.status(204).end();
  }

  me(req: Request, res: Response) {
    res.status(200).json({ user: req.user });
  }
}
