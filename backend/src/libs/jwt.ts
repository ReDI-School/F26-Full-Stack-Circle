import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET?.trim();

/** The value .env.example ships with, which must never sign a real token. */
const PLACEHOLDER = 'change-me-to-a-long-random-string';

// Checked while this module is first imported, which happens at startup.
// jsonwebtoken would reject an undefined secret anyway, but only on the
// first request that tries to sign one - by which point the service is
// already accepting traffic. Failing here turns a misconfiguration into a
// startup error instead of a runtime one.
if (!secret || secret === PLACEHOLDER) {
  throw new Error(
    'JWT_SECRET is missing or still the example value. Generate one with `openssl rand -base64 32` and put it in .env.'
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
