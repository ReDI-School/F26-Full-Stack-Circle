import prisma from '../libs/prisma';

export class HomeRowError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HomeRowError';
  }
}

const itemSelect = {
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
      position: 'asc' as const,
    },
  },
};

export class HomeRowService {
  async getAllHomeRows() {
    const homeRows = await prisma.homeRow.findMany({
      orderBy: {
        position: 'asc',
      },
      include: {
        items: {
          where: {
            item: {
              sold: false,
            },
          },
          orderBy: {
            position: 'asc',
          },
          include: {
            item: {
              select: itemSelect,
            },
          },
        },
      },
    });

    return {
      rows: homeRows.map((row) => ({
        key: row.key,
        title: row.title,
        items: row.items.map((rowItem) => rowItem.item),
      })),
    };
  }

  // Replace the complete contents of one homepage row.
  async updateHomeRow(key: string, itemIds: string[]) {
    // Check whether the row exists.
    const existingRow = await prisma.homeRow.findUnique({
      where: { key },
      select: { id: true },
    });

    if (!existingRow) {
      throw new HomeRowError(404, `Home row '${key}' not found.`);
    }

    // Maximum five items per row.
    if (itemIds.length > 5) {
      throw new HomeRowError(400, 'A home row can contain at most 5 items.');
    }

    // Prevent duplicate items.
    if (new Set(itemIds).size !== itemIds.length) {
      throw new HomeRowError(400, 'Duplicate item IDs are not allowed.');
    }

    // Check that every item exists.
    const existingItems = await prisma.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = new Set(existingItems.map((item) => item.id));

    const unknownIds = itemIds.filter((id) => !existingIds.has(id));

    if (unknownIds.length > 0) {
      throw new HomeRowError(400, `The following item IDs do not exist: ${unknownIds.join(', ')}`);
    }

    // Replace the existing items inside one transaction.
    const updatedRow = await prisma.$transaction(async (tx) => {
      await tx.homeRowItem.deleteMany({
        where: {
          homeRowId: existingRow.id,
        },
      });

      if (itemIds.length > 0) {
        await tx.homeRowItem.createMany({
          data: itemIds.map((itemId, index) => ({
            homeRowId: existingRow.id,
            itemId,
            position: index,
          })),
        });
      }

      return tx.homeRow.findUniqueOrThrow({
        where: {
          id: existingRow.id,
        },
        include: {
          items: {
            where: {
              item: {
                sold: false,
              },
            },
            orderBy: {
              position: 'asc',
            },
            include: {
              item: {
                select: itemSelect,
              },
            },
          },
        },
      });
    });

    return {
      row: {
        key: updatedRow.key,
        title: updatedRow.title,
        items: updatedRow.items.map((rowItem) => rowItem.item),
      },
    };
  }
}
