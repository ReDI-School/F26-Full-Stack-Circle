import bcrypt from 'bcryptjs';

import prisma from '../libs/prisma';

/**
 * An error the controller can turn straight into a response. Anything
 * else that escapes the service is a bug and becomes a 500.
 */
export class AuthError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Already validated by the controller: trimmed, lowercased email and a
 * password of at least 8 characters.
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

export class AuthService {
  /**
   * Creates an account and the shop that comes with it. The two are
   * written in one transaction: an account without a shop cannot list
   * anything, so a half-finished registration would leave someone with
   * a broken account for a person to fix by hand.
   */
  async register({ name, email, password }: RegisterInput): Promise<PublicUser> {
    // Not validation of the request, which the controller has already
    // done - this is the rule that no two accounts share an email, and
    // only the database can answer it.
    const taken = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (taken) {
      throw new AuthError(409, 'That email is already registered.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

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
  }
}
