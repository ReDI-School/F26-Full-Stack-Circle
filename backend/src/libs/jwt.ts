import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET;

// Thrown while this module is first imported, which happens at startup.
// Without it, jsonwebtoken would happily sign with `undefined` and every
// token would verify against every other deployment.
if (!secret) {
  throw new Error(
    'JWT_SECRET is not set. Copy .env.example to .env and give it a long random value.'
  );
}

/** Seven days, in seconds - the same lifetime as the auth cookie. */
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

/** Signs a token that identifies one user. */
export const signToken = (userId: string): string =>
  jwt.sign({ sub: userId }, secret, { expiresIn: TOKEN_TTL_SECONDS });

/**
 * Returns the user id the token was signed for, or null when the token is
 * missing, expired, tampered with, or signed by a different secret.
 */
export const verifyToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
};
