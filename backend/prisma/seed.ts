import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: (
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    ''
  ).replace('sslmode=require', 'sslmode=no-verify'),
});
const prisma = new PrismaClient({ adapter });

/** Prices are written in euros here and stored in whole cents. */
const eur = (amount: number) => Math.round(amount * 100);

/**
 * The password every seeded account shares, admin included. It only
 * ever reaches a local or preview database, and it is written down in
 * backend/README.md so the team can log in. Real accounts set their
 * own password at registration.
 */
const SEED_PASSWORD = 'redicycle123';

async function main() {
  console.log('🌱 Starting seed...');

  // Hashing once and reusing the result keeps the seed fast - bcrypt
  // is deliberately slow, which is the whole point of it.
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // ----------------------------------------------------------
  // 1. Categories - the five on the homepage and in the footer.
  //    `slug` is unique, so a plain upsert works.
  // ----------------------------------------------------------
  const categorySeed = [
    { slug: 'clothing', name: 'Clothing', emoji: '👕', tint: 0 },
    { slug: 'books', name: 'Books', emoji: '📚', tint: 1 },
    { slug: 'electronics', name: 'Electronics', emoji: '🔌', tint: 2 },
    { slug: 'home', name: 'Home', emoji: '🪴', tint: 0 },
    { slug: 'sports', name: 'Sports', emoji: '⚽', tint: 1 },
  ];

  const categories: Record<string, string> = {};
  for (const category of categorySeed) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categories[row.slug] = row.id;
  }
  console.log(`✅ ${categorySeed.length} categories`);

  // ----------------------------------------------------------
  // 2. People and their shops. Registering creates a shop, so the
  //    seed does the same: every account here owns exactly one.
  //    `email` is unique on User and `ownerId` is unique on Shop,
  //    so both upsert cleanly.
  // ----------------------------------------------------------
  const userSeed = [
    {
      key: 'lena',
      email: 'lena@redi-school.org',
      name: 'Lena K.',
      isAdmin: false,
      shopName: "Lena's shop",
      shopSubline: 'Sells & ships from Hamburg',
    },
    {
      key: 'omar',
      email: 'omar@redi-school.org',
      name: 'Omar M.',
      isAdmin: false,
      shopName: "Omar's shop",
      shopSubline: 'Sells & ships from Munich',
    },
    {
      key: 'mira',
      email: 'mira@redi-school.org',
      name: 'Mira S.',
      isAdmin: false,
      shopName: "Mira's shop",
      shopSubline: 'Sells & ships from Berlin',
    },
    {
      key: 'jonas',
      email: 'jonas@redi-school.org',
      name: 'Jonas B.',
      isAdmin: false,
      shopName: "Jonas' shop",
      shopSubline: 'Sells & ships from Cologne',
    },
    {
      key: 'sara',
      email: 'sara@redi-school.org',
      name: 'Sara T.',
      isAdmin: false,
      shopName: "Sara's shop",
      shopSubline: 'Sells & ships from Leipzig',
    },
    {
      key: 'admin',
      email: 'admin@redi-school.org',
      name: 'ReDiCycle Admin',
      isAdmin: true,
      shopName: 'ReDiCycle HQ',
      shopSubline: 'Sells & ships from Berlin',
    },
  ];

  const users: Record<string, string> = {};
  const shops: Record<string, string> = {};

  for (const user of userSeed) {
    const account = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        isAdmin: user.isAdmin,
        passwordHash,
      },
      create: {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        passwordHash,
      },
    });
    users[user.key] = account.id;

    const shop = await prisma.shop.upsert({
      where: { ownerId: account.id },
      update: { name: user.shopName, subline: user.shopSubline },
      create: {
        name: user.shopName,
        subline: user.shopSubline,
        ownerId: account.id,
      },
    });
    shops[user.key] = shop.id;
  }
  console.log(
    `✅ ${userSeed.length} accounts with a shop each ` +
      `(password: ${SEED_PASSWORD}, admin: admin@redi-school.org)`
  );

  // ----------------------------------------------------------
  // 3. Items.
  //
  // Item has no unique column to upsert on, and giving the rows
  // explicit ids would leave the autoincrement sequence behind, so
  // the first real registration would collide. Instead each item is
  // matched on title + shop, which is unique in this data, and
  // updated or created from there. The result is the same: running
  // the seed twice changes nothing and duplicates nothing.
  //
  // `was` is the price before the seller discounted it, and becomes
  // the struck-through number on the item detail page.
  // ----------------------------------------------------------
  type ItemSeed = {
    /** Only used inside this file, to wire home rows and threads up. */
    key: string;
    title: string;
    description: string;
    price: number;
    was?: number;
    condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED';
    category: string;
    shop: string;
  };

  const itemSeed: ItemSeed[] = [
    // Lena's shop
    {
      key: 'denim-jacket',
      title: 'Vintage denim jacket',
      price: 18,
      condition: 'LIKE_NEW',
      category: 'clothing',
      shop: 'lena',
      description: 'Classic mid-wash denim, boxy fit. Worn a handful of times.',
    },
    {
      key: 'keyboard',
      title: 'Wireless keyboard',
      price: 15,
      was: 22,
      condition: 'LIKE_NEW',
      category: 'electronics',
      shop: 'lena',
      description: 'Low-profile keys, USB-C charging. Dongle included.',
    },
    {
      key: 'plant-pots',
      title: 'Ceramic plant pots (x3)',
      price: 9,
      condition: 'LIKE_NEW',
      category: 'home',
      shop: 'lena',
      description: 'Three matte pots in cream, 12cm each. No drainage holes.',
    },
    {
      key: 'novel-box-set',
      title: 'Fantasy novel box set',
      price: 15,
      condition: 'GOOD',
      category: 'books',
      shop: 'lena',
      description: 'Complete trilogy, paperback. Spines a little creased.',
    },

    // Omar's shop
    {
      key: 'js-good-parts',
      title: 'JavaScript: The Good Parts',
      price: 6,
      condition: 'GOOD',
      category: 'books',
      shop: 'omar',
      description: 'Crockford classic. A few pencil notes in the margins.',
    },
    {
      key: 'speaker',
      title: 'Bluetooth speaker',
      price: 22,
      was: 30,
      condition: 'GOOD',
      category: 'electronics',
      shop: 'omar',
      description: 'Battery still holds about six hours. Charger included.',
    },
    {
      key: 'desk-chair',
      title: 'Desk chair, barely used',
      price: 25,
      condition: 'LIKE_NEW',
      category: 'home',
      shop: 'omar',
      description: 'Adjustable height, mesh back. Pickup only.',
    },

    // Mira's shop
    {
      key: 'desk-lamp',
      title: 'Retro desk lamp',
      price: 12,
      condition: 'GOOD',
      category: 'home',
      shop: 'mira',
      description: 'Brass-coloured arm, warm bulb included.',
    },
    {
      key: 'cookbooks',
      title: 'Cookbook bundle (x4)',
      price: 5,
      condition: 'USED',
      category: 'books',
      shop: 'mira',
      description: 'Four well-loved books. Some pages have cooking stains.',
    },
    {
      key: 'knit-sweater',
      title: 'Chunky knit sweater',
      price: 14,
      was: 20,
      condition: 'NEW',
      category: 'clothing',
      shop: 'mira',
      description:
        'Gift that never fit, tags still on. Size L, cream wool blend. ' + 'Very cozy, very warm.',
    },
    {
      key: 'football-boots',
      title: 'Football boots, size 42',
      price: 11,
      was: 25,
      condition: 'LIKE_NEW',
      category: 'sports',
      shop: 'mira',
      description: 'Firm ground studs. Used for one indoor season.',
    },

    // Jonas' shop
    {
      key: 'yoga-mat',
      title: 'Yoga mat + strap',
      price: 8,
      condition: 'USED',
      category: 'sports',
      shop: 'jonas',
      description: '6mm mat with a carry strap. Slightly worn at the corners.',
    },
    {
      key: 'band-tshirt',
      title: 'Band t-shirt, size M',
      price: 7,
      was: 12,
      condition: 'GOOD',
      category: 'clothing',
      shop: 'jonas',
      description: 'Tour shirt, print still crisp. Washed cold only.',
    },
    {
      key: 'polaroid',
      title: 'Polaroid camera',
      price: 35,
      condition: 'GOOD',
      category: 'electronics',
      shop: 'jonas',
      description: 'Works great. Takes i-Type film, not included.',
    },

    // Sara's shop
    {
      key: 'moving-boxes',
      title: 'Moving boxes (x8)',
      price: 0,
      condition: 'USED',
      category: 'home',
      shop: 'sara',
      description: 'Free to a good home. Folded flat, a couple have soft corners.',
    },
    {
      key: 'tennis-racket',
      title: 'Tennis racket',
      price: 13,
      condition: 'GOOD',
      category: 'sports',
      shop: 'sara',
      description: 'Grip re-wrapped last summer. Cover included.',
    },
  ];

  const items: Record<string, string> = {};
  for (const item of itemSeed) {
    const shopId = shops[item.shop];
    const data = {
      title: item.title,
      description: item.description,
      priceCents: eur(item.price),
      oldPriceCents: item.was ? eur(item.was) : null,
      condition: item.condition,
      categoryId: categories[item.category],
      shopId,
    };

    const existing = await prisma.item.findFirst({
      where: { title: item.title, shopId },
      select: { id: true },
    });

    const row = existing
      ? await prisma.item.update({ where: { id: existing.id }, data })
      : await prisma.item.create({ data });

    items[item.key] = row.id;

    // One photo per item. Upserting on (itemId, position) keeps a
    // second run from stacking duplicates.
    await prisma.itemPhoto.upsert({
      where: { itemId_position: { itemId: row.id, position: 0 } },
      update: { url: `/seed/${item.key}.jpg` },
      create: { itemId: row.id, position: 0, url: `/seed/${item.key}.jpg` },
    });
  }
  console.log(`✅ ${itemSeed.length} items with a photo each`);

  // ----------------------------------------------------------
  // 4. The curated homepage rows an admin fills on /admin.
  //    `key` is unique on HomeRow and (homeRowId, itemId) is unique
  //    on HomeRowItem, so both upsert.
  // ----------------------------------------------------------
  const rowSeed = [
    {
      key: 'fresh',
      title: 'fresh finds ✨',
      position: 0,
      itemKeys: ['denim-jacket', 'js-good-parts', 'desk-lamp', 'keyboard', 'yoga-mat'],
    },
    {
      key: 'cheap',
      title: 'under €10 💸',
      position: 1,
      itemKeys: ['js-good-parts', 'yoga-mat', 'plant-pots', 'band-tshirt', 'cookbooks'],
    },
    {
      key: 'deals',
      title: 'good deals 🔥',
      position: 2,
      itemKeys: ['keyboard', 'knit-sweater', 'band-tshirt', 'speaker', 'football-boots'],
    },
    {
      key: 'tech',
      title: 'tech corner 🔌',
      position: 3,
      itemKeys: ['keyboard', 'polaroid', 'speaker'],
    },
  ];

  for (const row of rowSeed) {
    const { itemKeys, ...rowData } = row;

    const homeRow = await prisma.homeRow.upsert({
      where: { key: row.key },
      update: { title: rowData.title, position: rowData.position },
      create: rowData,
    });

    for (const [position, key] of itemKeys.entries()) {
      await prisma.homeRowItem.upsert({
        where: {
          homeRowId_itemId: { homeRowId: homeRow.id, itemId: items[key] },
        },
        update: { position },
        create: { homeRowId: homeRow.id, itemId: items[key], position },
      });
    }
  }
  console.log(`✅ ${rowSeed.length} curated home rows`);

  // ----------------------------------------------------------
  // 5. Two conversations, so the inbox is not empty on first run.
  //    (itemId, buyerId) is unique on Thread, so these upsert; the
  //    messages inside are only created the first time round.
  // ----------------------------------------------------------
  const threadSeed = [
    {
      itemKey: 'denim-jacket',
      buyer: 'omar',
      seller: 'lena',
      messages: [
        {
          sender: 'omar',
          body: 'Hi! Is the denim jacket still available? Could I pick it up this week?',
          // Unread - this is the orange dot in the inbox list.
          read: false,
        },
      ],
    },
    {
      itemKey: 'polaroid',
      buyer: 'lena',
      seller: 'jonas',
      messages: [
        {
          sender: 'lena',
          body: 'Hi! I\'m interested in "Polaroid camera". Is it still available?',
          read: true,
        },
        {
          sender: 'jonas',
          body: 'Sure! It works great — when could you pick it up?',
          read: true,
        },
      ],
    },
  ];

  for (const thread of threadSeed) {
    const row = await prisma.thread.upsert({
      where: {
        itemId_buyerId: {
          itemId: items[thread.itemKey],
          buyerId: users[thread.buyer],
        },
      },
      update: {},
      create: {
        itemId: items[thread.itemKey],
        buyerId: users[thread.buyer],
        sellerId: users[thread.seller],
      },
    });

    // Messages have no natural unique key, so they are only written
    // when the thread is still empty.
    const existing = await prisma.message.count({
      where: { threadId: row.id },
    });
    if (existing === 0) {
      await prisma.message.createMany({
        data: thread.messages.map((message) => ({
          threadId: row.id,
          senderId: users[message.sender],
          body: message.body,
          readAt: message.read ? new Date() : null,
        })),
      });
    }
  }
  console.log(`✅ ${threadSeed.length} conversations`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
