import { Prisma } from '@generated/prisma/client';

import { AccountError } from '../errors/accountError';
import prisma from '../libs/prisma';
import { PublicUser, toPublicUser } from './authService';
import type { UpdateAccountInput } from '../schemas/AccountSchema';

/**
 * Every character JavaScript's `String.prototype.trim` removes, which is
 * what Zod's `.trim()` uses on the incoming email. PostgreSQL's `trim()`
 * only removes spaces, so a stored "\tAlice@Example.com\t" would slip past
 * it. Same helper as registration, so the uniqueness check agrees.
 */
const JS_WHITESPACE =
  '[\\t\\n\\v\\f\\r \\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]';
const EDGE_WHITESPACE = `^${JS_WHITESPACE}+|${JS_WHITESPACE}+$`;

const publicUserInclude = {
  shop: { select: { id: true, name: true, subline: true } },
} satisfies Prisma.UserInclude;

export class AccountService {
  async getById(userId: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: publicUserInclude,
    });

    return user ? toPublicUser(user) : null;
  }

  /**
   * Updates the user and, when `shopName` is sent, their shop. Both
   * writes share one transaction so a failed shop rename cannot leave
   * the profile half-changed.
   */
  async update(userId: string, input: UpdateAccountInput): Promise<PublicUser> {
    if (input.email !== undefined) {
      await this.assertEmailAvailable(userId, input.email);
    }

    try {
      const user = await prisma.$transaction(async (tx) => {
        if (input.shopName !== undefined) {
          const shop = await tx.shop.findUnique({
            where: { ownerId: userId },
            select: { id: true },
          });

          if (!shop) {
            throw new AccountError(400, 'You need a shop to rename it.');
          }

          await tx.shop.update({
            where: { id: shop.id },
            data: { name: input.shopName },
          });
        }

        return tx.user.update({
          where: { id: userId },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.email !== undefined ? { email: input.email } : {}),
            ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
          },
          include: publicUserInclude,
        });
      });

      return toPublicUser(user);
    } catch (error) {
      if (error instanceof AccountError) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AccountError(409, 'That email is already registered.');
      }

      throw error;
    }
  }

  /**
   * Option A: remove the account and every conversation they were in.
   *
   * Keeping threads (Option B) would mean nullable buyer/seller/sender
   * FKs and a "Deleted user" path in `GET /api/threads`. The schema
   * already cascades Thread and Message from User, and the inbox
   * assumes both participants exist — so deleting the threads is the
   * option that cannot crash the other person's inbox.
   *
   * The other participant's shop and items are left untouched. Threads
   * about *this* user's items go away with the items; threads where
   * they were only the buyer go away in the explicit thread delete.
   *
   * Order inside one transaction:
   * 1. this user's items (photos and homepage-row slots cascade)
   * 2. this user's shop
   * 3. remaining threads they were in (messages cascade)
   * 4. the user
   */
  async delete(userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const shop = await tx.shop.findUnique({
        where: { ownerId: userId },
        select: { id: true },
      });

      if (shop) {
        await tx.item.deleteMany({ where: { shopId: shop.id } });
        await tx.shop.delete({ where: { id: shop.id } });
      }

      await tx.thread.deleteMany({
        where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      });

      await tx.user.delete({ where: { id: userId } });
    });
  }

  /**
   * The caller's own current email (already stored, or the same address
   * after trim + lowercase) is allowed. Anyone else's is a 409.
   */
  private async assertEmailAvailable(userId: string, email: string): Promise<void> {
    const taken = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "User"
      WHERE lower(regexp_replace(email, ${EDGE_WHITESPACE}, '', 'g')) = ${email}
        AND id <> ${userId}
      LIMIT 1
    `;

    if (taken.length > 0) {
      throw new AccountError(409, 'That email is already registered.');
    }
  }
}
