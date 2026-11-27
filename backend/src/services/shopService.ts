import prisma from '@/libs/prisma';
import { GetShopsQuery } from '@/schemas/ShopSchema';

export class ShopService {
  async getShops({ take }: GetShopsQuery) {
    const shops = await prisma.shop.findMany({
      where: {
        items: {
          some: { sold: false },
        },
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            items: {
              where: { sold: false },
            },
          },
        },
      },
    });

    const mappedShops = shops
      .map(({ _count, ...shop }) => ({
        ...shop,
        itemCount: _count.items,
      }))
      .sort((a, b) => b.itemCount - a.itemCount || a.name.localeCompare(b.name));

    return typeof take === 'number' ? mappedShops.slice(0, take) : mappedShops;
  }

  async getShopById(id: string) {
    return prisma.shop.findUnique({
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
            category: {
              select: {
                slug: true,
                name: true,
              },
            },
            shop: {
              select: {
                id: true,
                name: true,
              },
            },
            photos: {
              select: {
                url: true,
              },
              orderBy: {
                position: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
