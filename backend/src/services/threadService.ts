import prisma from '../libs/prisma';
import { ThreadError } from '@/errors/threadError';

export class ThreadService {
  async expressInterest(itemId: string, buyerId: string) {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        title: true,
        sold: true,
        shop: { select: { ownerId: true } },
      },
    });

    if (!item) {
      throw new ThreadError(404, 'Item not found.');
    }

    // You can't express interest in your own item
    if (item.shop.ownerId === buyerId) {
      throw new ThreadError(400, 'This is your own item.');
    }

    // Item sold
    if (item.sold) {
      throw new ThreadError(409, 'This item has already been sold.');
    }

    const existing = await prisma.thread.findUnique({
      where: { itemId_buyerId: { itemId, buyerId } },
    });

    if (existing) {
      return { thread: existing, created: false };
    }

    const body = `Hi! I'm interested in "${item.title}". Is it still available?`;

    const thread = await prisma.thread.create({
      data: {
        itemId,
        buyerId,
        sellerId: item.shop.ownerId,
        messages: {
          create: {
            senderId: buyerId,
            body,
            readAt: null,
          },
        },
      },
    });

    return { thread, created: true };
  }
}
