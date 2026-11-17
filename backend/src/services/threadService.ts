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

/** The fields a message needs, wherever one is returned. */
const messageSelect = {
  id: true,
  body: true,
  senderId: true,
  createdAt: true,
  readAt: true,
} satisfies Prisma.MessageSelect;

interface ThreadBase {
  id: string;
  buyerId: string;
  sellerId: string;
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
  // Ready for item: null (the frontend then shows "Item removed"). Whether a
  // thread outlives its item is decided in #38 (DELETE /api/items/:id).
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

const toThreadMessage = (
  message: { id: string; body: string; senderId: string; createdAt: Date; readAt: Date | null },
  userId: string
): ThreadMessage => ({
  id: message.id,
  body: message.body,
  own: message.senderId === userId,
  createdAt: message.createdAt,
  readAt: message.readAt,
});

/**
 * The participant check, written once and used by every thread endpoint:
 * no such thread → 404, someone else's thread → 403. After it returns,
 * TypeScript knows the thread is not null.
 */
function assertParticipant<T extends { buyerId: string; sellerId: string }>(
  thread: T | null,
  userId: string
): asserts thread is T {
  if (!thread) {
    throw new ThreadError(404, 'Conversation not found.');
  }

  // The most sensitive check in the app: only the buyer and the seller
  // may read or write a conversation.
  if (thread.buyerId !== userId && thread.sellerId !== userId) {
    throw new ThreadError(403, 'You are not part of this conversation.');
  }
}

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
        // unread comes from _count, which counts every unread message in the
        // thread. messages[0] is only the newest message, for the preview line.
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
   * Reading it changes nothing: marking messages as read is its own
   * endpoint (markRead), so a prefetch never clears someone's badge.
   */
  async getById(threadId: string, userId: string): Promise<ThreadDetail> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: {
        ...threadBaseSelect,
        messages: { select: messageSelect, orderBy: { createdAt: 'asc' } },
      },
    });

    assertParticipant(thread, userId);

    const messages = thread.messages.map((message) => toThreadMessage(message, userId));
    const unread = messages.some((message) => !message.own && message.readAt === null);

    return {
      ...toThreadRow(thread, userId, thread.messages.at(-1), unread),
      messages,
    };
  }

  /**
   * A participant replies. The controller has already trimmed the body and
   * checked its length; it is stored exactly as typed, newlines included and
   * not HTML-escaped (React escapes text when it renders it).
   */
  async sendMessage(threadId: string, userId: string, body: string): Promise<ThreadMessage> {
    await this.findForParticipant(threadId, userId);

    // Together: the message, and the thread's updatedAt, which the schema
    // promises is bumped on every new message.
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: { threadId, senderId: userId, body },
        select: messageSelect,
      }),
      prisma.thread.update({
        where: { id: threadId },
        data: { updatedAt: new Date() },
        select: { id: true },
      }),
    ]);

    return toThreadMessage(message, userId);
  }

  /**
   * Marks every message from the other person in this thread as read; your
   * own messages are left alone. Safe to repeat: on an already-read thread
   * there is simply nothing left to update.
   */
  async markRead(threadId: string, userId: string): Promise<void> {
    await this.findForParticipant(threadId, userId);

    await prisma.message.updateMany({
      where: { threadId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
  }

  /** Loads just enough of a thread to run the participant check. */
  private async findForParticipant(threadId: string, userId: string): Promise<void> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { buyerId: true, sellerId: true },
    });

    assertParticipant(thread, userId);
  }
}
