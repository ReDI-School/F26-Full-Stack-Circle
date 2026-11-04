import { Prisma } from '@generated/prisma/client';
import prisma from '../libs/prisma';
import { ItemError } from '@/errors/itemError';
import { CreateItemInput, GetItemsQuery, UpdateItemInput } from '@/schemas/ItemSchema';

type OwnedItem = { id: string; priceCents: number; sold: boolean };
type PriceChange = { priceCents?: number; oldPriceCents?: number | null };

function formatEuro(cents: number) {
  return `€ ${cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2)}`;
}

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

  async getOwnedItem(id: string, userId: string): Promise<OwnedItem> {
    const item = await prisma.item.findUnique({
      where: { id },
      select: { id: true, priceCents: true, sold: true, shop: { select: { ownerId: true } } },
    });

    if (!item) {
      throw new ItemError(404, 'Item not found');
    }

    if (item.shop.ownerId !== userId) {
      throw new ItemError(403, 'This item is not yours.');
    }

    return item;
  }

  priceChange(
    item: OwnedItem,
    { priceCents, oldPriceCents }: Pick<UpdateItemInput, 'priceCents' | 'oldPriceCents'>
  ): { error: string } | { data: PriceChange } {
    if (priceCents === undefined) {
      return { data: oldPriceCents === null ? { oldPriceCents: null } : {} };
    }

    if (item.sold) {
      return { error: 'A sold item cannot be discounted.' };
    }

    if (oldPriceCents === null) {
      return { data: { priceCents, oldPriceCents: null } };
    }

    if (priceCents >= item.priceCents) {
      return { error: `New price must be lower than ${formatEuro(item.priceCents)}` };
    }

    return { data: { priceCents, oldPriceCents: item.priceCents } };
  }

  async update(
    id: string,
    input: Omit<UpdateItemInput, 'priceCents' | 'oldPriceCents'> & PriceChange
  ) {
    const { photoUrls, ...item } = input;

    if (!photoUrls) {
      return prisma.item.update({ where: { id }, data: item, include: itemDetails });
    }

    const [, updated] = await prisma.$transaction([
      prisma.itemPhoto.deleteMany({ where: { itemId: id } }),
      prisma.item.update({
        where: { id },
        data: {
          ...item,
          photos: { create: photoUrls.map((url, position) => ({ url, position })) },
        },
        include: itemDetails,
      }),
    ]);

    return updated;
  }
}
