import { Request, Response } from 'express';
import { z } from 'zod';

import { TOKEN_TTL_SECONDS, signToken } from '../libs/jwt';
import { AuthError, AuthService } from '../services/authService';

const authService = new AuthService();

/**
 * The shape of a valid registration request. `trim` and `toLowerCase` are
 * transforms, not just checks, so the service receives the cleaned values -
 * which is what makes Ada@... and ada@... the same account.
 */
const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  // bcrypt hashes only the first 72 bytes and discards the rest without
  // complaining, so a longer password would be half-accepted: the prefix
  // alone would log you in. Rejecting it is better than silently
  // throwing part of someone's credential away.
  password: z
    .string()
    .min(8)
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, {
      message: 'Password must be at most 72 bytes long.',
    }),
});

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
