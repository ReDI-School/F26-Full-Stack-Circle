import { Prisma } from '../../../generated/prisma/client';

export type TCategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { items: true } } };
}>;
