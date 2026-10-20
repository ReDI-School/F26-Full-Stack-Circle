import { Prisma } from '@generated/prisma/client';
import prisma from '../libs/prisma';
import { ItemError } from '@/errors/itemError';
import { GetItemsQuery } from '@/schemas/ItemSchema';

export class ItemService {
  async getItems(params: GetItemsQuery) {
    const { category, q, shopId, take = 50, skip = 0 } = params;

    const where: Prisma.ItemWhereInput = {
      sold: false,
    };

    if (category) {
      where.category = { slug: category };
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
    const [items, total, categoryExists] = await Promise.all([
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
          photos: { select: { url: true }, orderBy: { position: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.item.count({ where }),
      category
        ? prisma.category.findUnique({
            where: { slug: category },
            select: { slug: true },
          })
        : Promise.resolve(null),
    ]);

    if (category && !categoryExists) {
      throw new ItemError(400, `Category '${category}' does not exist.`);
    }

    return { items, total };
  }
}
