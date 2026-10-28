import prisma from '@/libs/prisma';
import { GetShopsQuery } from '@/schemas/ShopSchema';
import { ensureFound } from '@/shared/errors';

export class ShopService {
  async getShops({ take }: GetShopsQuery) {
    const shops = await prisma.shop.findMany({
      where: { items: { some: { sold: false } } },
      select: {
        id: true,
        name: true,
        owner: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { items: { where: { sold: false } } } },
      },
    });
    return shops
      .map(({ _count, ...shop }) => ({ ...shop, itemCount: _count.items }))
      .sort((a, b) => b.itemCount - a.itemCount || a.name.localeCompare(b.name))
      .slice(0, take);
  }

  async getShopById(id: string) {
    const shop = await prisma.shop.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        subline: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        items: {
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
        },
      },
    });

    return ensureFound(shop, 'Shop', id);
  }
}
