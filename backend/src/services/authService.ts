import bcrypt from 'bcryptjs';

import { EmailAlreadyRegisteredError } from '../errors/authErrors';
import prisma from '../libs/prisma';

/**
 * Already validated by the controller: trimmed, lowercased email and a
 * password of 8 to 64 characters that also fits in bcrypt's 72 bytes.
 */
export interface RegisterInput {
  name: string;
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

/** Prisma's code for "a unique constraint rejected this write". */
const isUniqueViolation = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code: unknown }).code === 'P2002';

export class AuthService {
  /**
   * Creates an account and the shop that comes with it. The two are
   * written in one transaction: an account without a shop cannot list
   * anything, so a half-finished registration would leave someone with
   * a broken account for a person to fix by hand.
   */
  async register({ name, email, password }: RegisterInput): Promise<PublicUser> {
    // Older user routes stored emails exactly as typed, so a row may hold
    // " Alice@Example.com ". Normalise the stored side the same way Zod
    // normalised the input, and compare with `=`. Prisma's
    // `mode: 'insensitive'` compiles to ILIKE, where `_` and `%` are
    // wildcards: john_doe@... would match an existing john.doe@...
    // The tagged template sends `email` as a bound parameter, not SQL.
    const taken = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "User" WHERE lower(trim(email)) = ${email} LIMIT 1
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
}
