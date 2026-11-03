import { Prisma } from '@generated/prisma/client';
import prisma from '../libs/prisma';
import { ItemError } from '@/errors/itemError';
import { CreateItemInput, GetItemsQuery } from '@/schemas/ItemSchema';

const itemDetails = {
  category: { select: { slug: true, name: true } },
  shop: {
    select: {
      id: true,
      name: true,
      subline: true,
      owner: { select: { id: true, name: true, avatarUrl: true } },
    },
  },
  photos: {
    select: { id: true, url: true, position: true },
    orderBy: { position: 'asc' },
  },
} satisfies Prisma.ItemInclude;

export class ItemService {
  async categoryExists(id: string) {
    return (await prisma.category.findUnique({ where: { id }, select: { id: true } })) !== null;
  }

  async create(shopId: string, input: CreateItemInput) {
    const { photoUrls = [], ...item } = input;

    // Nested creation keeps the item and its ordered photos in one transaction.
    return prisma.item.create({
      data: {
        ...item,
        shopId,
        photos: { create: photoUrls.map((url, position) => ({ url, position })) },
      },
      include: itemDetails,
    });
  }

  async getItems(params: GetItemsQuery) {
    const { category, q, shopId, take, skip } = params;

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

  async getById(id: string) {
    return prisma.item.findUnique({
      where: { id },
      include: itemDetails,
    });
  }
}
