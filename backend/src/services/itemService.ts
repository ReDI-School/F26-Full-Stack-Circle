import { Prisma } from '@generated/prisma/client';
import prisma from '../libs/prisma';

interface GetItemsParams {
  category?: string;
  q?: string;
  shopId?: string;
  take?: number;
  skip?: number;
}

export class ItemService {
  async getItems(params: GetItemsParams) {
    const { category, q, shopId, take = 50, skip = 0 } = params;

    const parsedTake = Number(take);
    const parsedSkip = Number(skip);

    if (
      !Number.isInteger(parsedTake) ||
      !Number.isInteger(parsedSkip) ||
      parsedTake <= 0 ||
      parsedSkip < 0
    ) {
      throw new Error(
        'INVALID_PAGINATION: take must be a positive integer and skip must be a non-negative integer.',
      );
    }

    const where: Prisma.ItemWhereInput = {
      sold: false,
    };

    if (category) {
      const categoryExists = await prisma.category.findUnique({
        where: { slug: category },
      });

      if (!categoryExists) {
        throw new Error(`INVALID_CATEGORY: Category '${category}' does not exist.`);
      }

      where.category = {
        slug: category,
      };
    }

    if (shopId) {
      where.shopId = shopId;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        select: {
          id: true,
          title: true,
          priceCents: true,
          oldPriceCents: true,
          condition: true,
          sold: true,
          category: { select: { slug: true, name: true } },
          shop: { select: { id: true, name: true } },
          photos: { select: { url: true }, orderBy: { position: 'asc' }, },
        },
        orderBy: { createdAt: 'desc' },
        take: Math.min(parsedTake, 100),
        skip: parsedSkip,
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total };
  }
}
