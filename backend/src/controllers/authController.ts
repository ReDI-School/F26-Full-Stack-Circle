import { Request, Response } from 'express';
import { z } from 'zod';

import { EmailAlreadyRegisteredError } from '@/errors/authErrors';
import { TOKEN_TTL_SECONDS, signToken } from '../libs/jwt';
import { AuthService } from '../services/authService';

const authService = new AuthService();

/**
 * The shape of a valid registration request. `trim` and `toLowerCase` are
 * transforms, not just checks, so the service receives the cleaned values -
 * which is what makes Ada@... and ada@... the same account.
 */
const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  // The character limit is what a person sees. The byte check stays as a
  // backstop: bcrypt hashes only the first 72 bytes and silently drops
  // the rest, and 64 characters of emoji or Cyrillic can still exceed
  // that. Truncation would let the prefix alone log you in.
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password must be at most 64 characters.')
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, {
      message: 'Password is too long.',
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
      // Mapping domain errors to HTTP status codes happens here, at the
      // transport boundary, not in the service.
      if (error instanceof EmailAlreadyRegisteredError) {
        return res.status(409).json({ error: error.message });
      }

      console.error('Error registering user:', error);

      res.status(500).json({ error: 'Failed to register' });
    }
  }
}
