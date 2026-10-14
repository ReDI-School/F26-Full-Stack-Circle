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

const MIN_PASSWORD_LENGTH = 8;

// Deliberately permissive: the only thing worth rejecting here is input
// that is obviously not an address. Real verification is an email round
// trip, which is a different ticket.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  async register(input: RegisterInput): Promise<PublicUser> {
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const password = typeof input.password === 'string' ? input.password : '';

    if (!name) {
      throw new AuthError(400, 'Please enter your name.');
    }

    if (!email) {
      throw new AuthError(400, 'Please enter your email address.');
    }

    if (!EMAIL_PATTERN.test(email)) {
      throw new AuthError(400, 'That does not look like an email address.');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new AuthError(400, `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.`);
    }

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
