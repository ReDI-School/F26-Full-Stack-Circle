import bcrypt from 'bcryptjs';

import { EmailAlreadyRegisteredError } from '../shared/errors/authErrors';
import prisma from '@/libs/prisma';

/**
 * Already validated by the controller: trimmed, lowercased email and a
 * password of 8 to 64 characters that also fits in bcrypt's 72 bytes.
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * The only shape of a user that ever leaves the API. `passwordHash` is
 * not on it, and cannot be added by accident, because every response
 * goes through here rather than returning the Prisma object directly.
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  shop: { id: string; name: string } | null;
}

const toPublicUser = (user: {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  shop?: { id: string; name: string } | null;
}): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  shop: user.shop ? { id: user.shop.id, name: user.shop.name } : null,
});

/** "Lena K." becomes "Lena's shop". */
const defaultShopName = (name: string): string => {
  const firstName = name.trim().split(/\s+/)[0];

  return `${firstName}'s shop`;
};

/**
 * Every character JavaScript's `String.prototype.trim` removes, which is
 * what Zod's `.trim()` uses on the incoming email. PostgreSQL's `trim()`
 * only removes spaces, so a stored "\tAlice@Example.com\t" would slip past
 * it. Written as a PostgreSQL regex and sent as a bound parameter.
 */
const JS_WHITESPACE =
  '[\\t\\n\\v\\f\\r \\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]';
const EDGE_WHITESPACE = `^${JS_WHITESPACE}+|${JS_WHITESPACE}+$`;

/** Prisma's code for "a unique constraint rejected this write". */
const isUniqueViolation = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code: unknown }).code === 'P2002';

/**
 * A real bcrypt hash of a made-up password. Used when the email isn't found,
 * so that case takes as long as a wrong password and the response time
 * doesn't reveal which emails are registered.
 */
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

export class AuthService {
  /**
   * Creates an account and the shop that comes with it. The two are
   * written in one transaction: an account without a shop cannot list
   * anything, so a half-finished registration would leave someone with
   * a broken account for a person to fix by hand.
   */
  async register({ name, email, password }: RegisterInput): Promise<PublicUser> {
    // Older user routes stored emails exactly as typed, so a row may hold
    // " Alice@Example.com " or "\tAlice@Example.com\n". Normalise the
    // stored side exactly the way Zod normalised the input (same
    // whitespace set, then lowercase) and compare with `=`. Prisma's
    // `mode: 'insensitive'` compiles to ILIKE, where `_` and `%` are
    // wildcards: john_doe@... would match an existing john.doe@...
    // The tagged template sends both values as bound parameters, not SQL.
    const taken = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "User"
      WHERE lower(regexp_replace(email, ${EDGE_WHITESPACE}, '', 'g')) = ${email}
      LIMIT 1
    `;

    if (taken.length > 0) {
      throw new EmailAlreadyRegisteredError();
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: { name, email, passwordHash },
        });

        const shop = await tx.shop.create({
          data: { name: defaultShopName(name), ownerId: created.id },
        });

        return { ...created, shop };
      });

      return toPublicUser(user);
    } catch (error) {
      // Two registrations for the same address can both pass the check
      // above and race to the insert. The loser is a duplicate, not a
      // server fault, so it gets the same error as the sequential case.
      if (isUniqueViolation(error)) {
        throw new EmailAlreadyRegisteredError();
      }

      throw error;
    }
  }

  async login({ email, password }: LoginInput): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { shop: true },
    });

    const hashToCheck = user?.passwordHash ?? DUMMY_HASH;
    const passwordMatches = await bcrypt.compare(password, hashToCheck);

    if (!user || !passwordMatches) {
      return null;
    }

    return toPublicUser(user);
  }

  async findPublicUserById(id: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { shop: true },
    });

    return user ? toPublicUser(user) : null;
  }
}
