import prisma from '../libs/prisma';
import { ThreadError } from '@/errors/threadError';
import { Prisma } from '@generated/prisma/client';

/** One row of the inbox: exactly what ThreadList renders, no more. */
export interface ThreadRow {
  id: string;
  /** The other person in the conversation, never the logged-in user. */
  withName: string;
  /** null when the item is gone; the frontend then shows "Item removed". */
  item: { id: string; title: string; priceCents: number; photoUrl: string | null } | null;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  /** At least one message someone else sent that the user has not read. */
  unread: boolean;
}

export interface ThreadMessage {
  id: string;
  body: string;
  /** Sent by the logged-in user: MessageBubble puts it on the right. */
  own: boolean;
  createdAt: Date;
  readAt: Date | null;
}

export interface ThreadDetail extends ThreadRow {
  /** Oldest first, the way a chat reads. */
  messages: ThreadMessage[];
}

/** The fields both inbox endpoints need: the people, and the item with its main photo. */
const threadBaseSelect = {
  id: true,
  buyerId: true,
  sellerId: true,
  createdAt: true,
  buyer: { select: { name: true } },
  seller: { select: { name: true } },
  item: {
    select: {
      id: true,
      title: true,
      priceCents: true,
      photos: { select: { url: true }, orderBy: { position: 'asc' }, take: 1 },
    },
  },
} satisfies Prisma.ThreadSelect;

interface ThreadBase {
  id: string;
  buyerId: string;
  buyer: { name: string };
  seller: { name: string };
  item: {
    id: string;
    title: string;
    priceCents: number;
    photos: { url: string }[];
  } | null;
}

const toThreadRow = (
  thread: ThreadBase,
  userId: string,
  lastMessage: { body: string; createdAt: Date } | undefined,
  unread: boolean
): ThreadRow => ({
  id: thread.id,
  // You are the buyer in some threads and the seller in others, so the
  // other person has to be worked out per thread. Getting this backwards
  // makes every conversation look like it is with yourself.
  withName: thread.buyerId === userId ? thread.seller.name : thread.buyer.name,
  // Today the schema deletes a thread together with its item, so item is
  // always set. If that ever becomes "keep the thread", this already
  // returns null and the frontend shows "Item removed".
  item: thread.item
    ? {
        id: thread.item.id,
        title: thread.item.title,
        priceCents: thread.item.priceCents,
        photoUrl: thread.item.photos[0]?.url ?? null,
      }
    : null,
  lastMessage: lastMessage?.body ?? null,
  lastMessageAt: lastMessage?.createdAt ?? null,
  unread,
});

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

    try {
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
    } catch (error) {
      // Two requests arrived at once, both found no thread, and both tried to
      // create one. The loser hits the unique (itemId, buyerId) constraint:
      // return the thread the winner just made instead of failing.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const thread = await prisma.thread.findUnique({
          where: { itemId_buyerId: { itemId, buyerId } },
        });

        if (thread) {
          return { thread, created: false };
        }
      }

      throw error;
    }
  }

  /**
   * The logged-in user's conversations, most recent message first, plus how
   * many of them have unread messages (the navbar badge).
   *
   * One findMany: Prisma loads each relation for all threads at once, so the
   * number of queries stays the same for 2 threads or 200 (no N+1).
   */
  async listForUser(userId: string): Promise<{ threads: ThreadRow[]; unreadCount: number }> {
    const threads = await prisma.thread.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      select: {
        ...threadBaseSelect,
        // Only the newest message is needed for the preview line.
        messages: {
          select: { body: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        // Unread = sent by someone else and not read yet. Your own
        // messages are never unread for you.
        _count: {
          select: { messages: { where: { readAt: null, senderId: { not: userId } } } },
        },
      },
    });

    const rows = threads
      .map((thread) => ({
        row: toThreadRow(thread, userId, thread.messages[0], thread._count.messages > 0),
        // A thread without messages sorts by when it was started.
        sortAt: (thread.messages[0]?.createdAt ?? thread.createdAt).getTime(),
      }))
      // Prisma can't order by "newest related message", so sort here. The
      // list is one user's conversations, which stays small.
      .sort((a, b) => b.sortAt - a.sortAt)
      .map(({ row }) => row);

    return {
      threads: rows,
      unreadCount: rows.filter((row) => row.unread).length,
    };
  }

  /**
   * One conversation with all its messages, for a participant only.
   * Unknown id → 404; someone else's thread → 403.
   */
  async getById(threadId: string, userId: string): Promise<ThreadDetail> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: {
        ...threadBaseSelect,
        messages: {
          select: { id: true, body: true, senderId: true, createdAt: true, readAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!thread) {
      throw new ThreadError(404, 'Conversation not found.');
    }

    // The most sensitive check in the app: load first, then make sure the
    // logged-in user is the buyer or the seller before returning anything.
    if (thread.buyerId !== userId && thread.sellerId !== userId) {
      throw new ThreadError(403, 'You are not part of this conversation.');
    }

    const messages: ThreadMessage[] = thread.messages.map((message) => ({
      id: message.id,
      body: message.body,
      own: message.senderId === userId,
      createdAt: message.createdAt,
      readAt: message.readAt,
    }));

    const unread = messages.some((message) => !message.own && message.readAt === null);

    return {
      ...toThreadRow(thread, userId, thread.messages.at(-1), unread),
      messages,
    };
  }
}
