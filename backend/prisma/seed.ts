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
 * The password every seeded account shares. It is only ever used on
 * a local or preview database, and it is written down in
 * backend/README.md so the team can log in. Real accounts set their
 * own password at registration.
 */
const SEED_PASSWORD = 'redicycle123';

async function main() {
  console.log('🌱 Starting seed...');

  // ----------------------------------------------------------
  // 1. Clear the curated content, listings and conversations.
  //
  // Accounts and categories are upserted further down instead of
  // deleted, so running the seed twice never throws away a account
  // someone registered while testing. Everything else is sample
  // data and is rebuilt from scratch, which keeps the seed
  // repeatable without inventing fake unique keys for items.
  //
  // The order matters: children first, parents after.
  // ----------------------------------------------------------
  await prisma.homepageRowItem.deleteMany();
  await prisma.homepageRow.deleteMany();
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.itemImage.deleteMany();
  await prisma.item.deleteMany();
  await prisma.shop.deleteMany();

  // ----------------------------------------------------------
  // 2. Categories - the five on the homepage and in the footer.
  // ----------------------------------------------------------
  const categorySeed = [
    { slug: 'clothing', name: 'Clothing', emoji: '👕', tint: 'primary', sortOrder: 1 },
    { slug: 'books', name: 'Books', emoji: '📚', tint: 'secondary', sortOrder: 2 },
    { slug: 'electronics', name: 'Electronics', emoji: '🔌', tint: 'tertiary', sortOrder: 3 },
    { slug: 'home', name: 'Home', emoji: '🪴', tint: 'primary', sortOrder: 4 },
    { slug: 'sports', name: 'Sports', emoji: '⚽', tint: 'secondary', sortOrder: 5 },
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
  // 3. People.
  //
  // Every account gets a real bcrypt hash of SEED_PASSWORD, so the
  // login form works against seeded users exactly as it will against
  // registered ones. Hashing once and reusing the result keeps the
  // seed fast - bcrypt is deliberately slow.
  // ----------------------------------------------------------
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const userSeed = [
    { email: 'lena@redi-school.org', name: 'Lena K.', role: 'ADMIN' as const },
    { email: 'omar@redi-school.org', name: 'Omar M.', role: 'USER' as const },
    { email: 'mira@redi-school.org', name: 'Mira S.', role: 'USER' as const },
    { email: 'jonas@redi-school.org', name: 'Jonas B.', role: 'USER' as const },
  ];

  const users: Record<string, string> = {};
  for (const user of userSeed) {
    const row = await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, passwordHash },
      create: { ...user, passwordHash },
    });
    users[row.email] = row.id;
  }
  console.log(`✅ ${userSeed.length} accounts (password: ${SEED_PASSWORD}, see backend/README.md)`);

  // ----------------------------------------------------------
  // 4. Shops - one per account, as the homepage promises.
  // ----------------------------------------------------------
  const shopSeed = [
    {
      slug: 'lenas-shop',
      name: "Lena's shop",
      location: 'Sells & ships from Hamburg',
      owner: 'lena@redi-school.org',
    },
    {
      slug: 'omars-shop',
      name: "Omar's shop",
      location: 'Sells & ships from Munich',
      owner: 'omar@redi-school.org',
    },
    {
      slug: 'miras-shop',
      name: "Mira's shop",
      location: 'Sells & ships from Berlin',
      owner: 'mira@redi-school.org',
    },
    {
      slug: 'jonas-shop',
      name: "Jonas' shop",
      location: 'Sells & ships from Cologne',
      owner: 'jonas@redi-school.org',
    },
  ];

  const shops: Record<string, string> = {};
  for (const shop of shopSeed) {
    const { owner, ...shopData } = shop;
    const row = await prisma.shop.create({
      data: { ...shopData, ownerId: users[owner] },
    });
    shops[row.slug] = row.id;
  }
  console.log(`✅ ${shopSeed.length} shops, one per account`);

  // ----------------------------------------------------------
  // 5. Items.
  //
  // `was` is the price before the seller discounted it, and becomes
  // the struck-through number on the item detail page.
  // ----------------------------------------------------------
  type ItemSeed = {
    /** Only used inside this file, to wire rows and threads to items. */
    key: string;
    title: string;
    description: string;
    price: number;
    /** The price before the seller discounted it. */
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
      shop: 'lenas-shop',
      description: 'Classic mid-wash denim, boxy fit. Worn a handful of times.',
    },
    {
      key: 'keyboard',
      title: 'Wireless keyboard',
      price: 15,
      was: 22,
      condition: 'LIKE_NEW',
      category: 'electronics',
      shop: 'lenas-shop',
      description: 'Low-profile keys, USB-C charging. Dongle included.',
    },
    {
      key: 'plant-pots',
      title: 'Ceramic plant pots (x3)',
      price: 9,
      condition: 'LIKE_NEW',
      category: 'home',
      shop: 'lenas-shop',
      description: 'Three matte pots in cream, 12cm each. No drainage holes.',
    },
    {
      key: 'novel-box-set',
      title: 'Fantasy novel box set',
      price: 15,
      condition: 'GOOD',
      category: 'books',
      shop: 'lenas-shop',
      description: 'Complete trilogy, paperback. Spines a little creased.',
    },

    // Omar's shop
    {
      key: 'js-good-parts',
      title: 'JavaScript: The Good Parts',
      price: 6,
      condition: 'GOOD',
      category: 'books',
      shop: 'omars-shop',
      description: 'Crockford classic. A few pencil notes in the margins.',
    },
    {
      key: 'speaker',
      title: 'Bluetooth speaker',
      price: 22,
      was: 30,
      condition: 'GOOD',
      category: 'electronics',
      shop: 'omars-shop',
      description: 'Battery still holds about six hours. Charger included.',
    },
    {
      key: 'desk-chair',
      title: 'Desk chair, barely used',
      price: 25,
      condition: 'LIKE_NEW',
      category: 'home',
      shop: 'omars-shop',
      description: 'Adjustable height, mesh back. Pickup only.',
    },
    {
      key: 'running-shoes',
      title: 'Running shoes, size 44',
      price: 16,
      condition: 'GOOD',
      category: 'sports',
      shop: 'omars-shop',
      description: 'Maybe 80km on them. Soles still have plenty of grip.',
    },

    // Mira's shop
    {
      key: 'desk-lamp',
      title: 'Retro desk lamp',
      price: 12,
      condition: 'GOOD',
      category: 'home',
      shop: 'miras-shop',
      description: 'Brass-coloured arm, warm bulb included.',
    },
    {
      key: 'cookbooks',
      title: 'Cookbook bundle (x4)',
      price: 5,
      condition: 'USED',
      category: 'books',
      shop: 'miras-shop',
      description: 'Four well-loved books. Some pages have cooking stains.',
    },
    {
      key: 'knit-sweater',
      title: 'Chunky knit sweater',
      price: 14,
      was: 20,
      condition: 'NEW',
      category: 'clothing',
      shop: 'miras-shop',
      description:
        'Gift that never fit, tags still on. Size L, cream wool blend. Very cozy, very warm.',
    },
    {
      key: 'football-boots',
      title: 'Football boots, size 42',
      price: 11,
      was: 25,
      condition: 'LIKE_NEW',
      category: 'sports',
      shop: 'miras-shop',
      description: 'Firm ground studs. Used for one indoor season.',
    },

    // Jonas' shop
    {
      key: 'yoga-mat',
      title: 'Yoga mat + strap',
      price: 8,
      condition: 'USED',
      category: 'sports',
      shop: 'jonas-shop',
      description: '6mm mat with a carry strap. Slightly worn at the corners.',
    },
    {
      key: 'band-tshirt',
      title: 'Band t-shirt, size M',
      price: 7,
      was: 12,
      condition: 'GOOD',
      category: 'clothing',
      shop: 'jonas-shop',
      description: 'Tour shirt, print still crisp. Washed cold only.',
    },
    {
      key: 'polaroid',
      title: 'Polaroid camera',
      price: 35,
      condition: 'GOOD',
      category: 'electronics',
      shop: 'jonas-shop',
      description: 'Works great. Takes i-Type film, not included.',
    },
    {
      key: 'wool-scarf',
      title: 'Wool scarf',
      price: 6,
      condition: 'GOOD',
      category: 'clothing',
      shop: 'jonas-shop',
      description: 'Charcoal lambswool, nice and long. No moth holes.',
    },
  ];

  const items: Record<string, string> = {};
  for (const item of itemSeed) {
    const row = await prisma.item.create({
      data: {
        title: item.title,
        description: item.description,
        priceCents: eur(item.price),
        originalPriceCents: item.was ? eur(item.was) : null,
        condition: item.condition,
        categoryId: categories[item.category],
        shopId: shops[item.shop],
        images: {
          create: [{ url: `/seed/${item.key}.jpg`, position: 0 }],
        },
      },
    });
    items[item.key] = row.id;
  }
  console.log(`✅ ${itemSeed.length} items, four per shop`);

  // ----------------------------------------------------------
  // 6. The curated homepage rows an admin fills on the admin page.
  // ----------------------------------------------------------
  const rowSeed = [
    {
      slug: 'fresh-finds',
      title: 'fresh finds',
      emoji: '✨',
      subtitle: 'just listed by the community',
      linkLabel: 'see everything',
      linkHref: '/browse',
      sortOrder: 1,
      itemKeys: ['denim-jacket', 'js-good-parts', 'desk-lamp', 'keyboard', 'yoga-mat'],
    },
    {
      slug: 'under-10',
      title: 'under €10',
      emoji: '💸',
      subtitle: 'broke, but make it fashion',
      linkLabel: 'more bargains',
      linkHref: '/browse?maxPrice=10',
      sortOrder: 2,
      itemKeys: ['js-good-parts', 'yoga-mat', 'plant-pots', 'band-tshirt', 'cookbooks'],
    },
    {
      slug: 'good-deals',
      title: 'good deals',
      emoji: '🔥',
      subtitle: 'prices dropped by the sellers',
      linkLabel: 'see all deals',
      linkHref: '/browse?discounted=true',
      sortOrder: 3,
      itemKeys: ['keyboard', 'knit-sweater', 'band-tshirt', 'speaker', 'football-boots'],
    },
    {
      slug: 'tech-corner',
      title: 'tech corner',
      emoji: '🔌',
      subtitle: 'pre-loved gadgets that still go beep',
      linkLabel: 'all electronics',
      linkHref: '/browse?category=electronics',
      sortOrder: 4,
      itemKeys: ['keyboard', 'polaroid', 'speaker'],
    },
  ];

  for (const row of rowSeed) {
    const { itemKeys, ...rowData } = row;
    await prisma.homepageRow.create({
      data: {
        ...rowData,
        items: {
          create: itemKeys.map((key, index) => ({
            itemId: items[key],
            position: index,
          })),
        },
      },
    });
  }
  console.log(`✅ ${rowSeed.length} curated homepage rows`);

  // ----------------------------------------------------------
  // 7. Two conversations, so the inbox is not empty on first run.
  //    Both are the ones drawn on the Inbox screen.
  // ----------------------------------------------------------

  // Omar asks Lena about her denim jacket, and she has not read it
  // yet - that is the orange dot in the inbox list.
  await prisma.thread.create({
    data: {
      itemId: items['denim-jacket'],
      buyerId: users['omar@redi-school.org'],
      messages: {
        create: [
          {
            senderId: users['omar@redi-school.org'],
            body: 'Hi! Is the denim jacket still available? Could I pick it up this week?',
          },
        ],
      },
    },
  });

  // Lena asks Jonas about his camera, and he has replied.
  await prisma.thread.create({
    data: {
      itemId: items['polaroid'],
      buyerId: users['lena@redi-school.org'],
      messages: {
        create: [
          {
            senderId: users['lena@redi-school.org'],
            body: 'Hi! I\'m interested in "Polaroid camera". Is it still available?',
            readAt: new Date(),
          },
          {
            senderId: users['jonas@redi-school.org'],
            body: 'Sure! It works great — when could you pick it up?',
            readAt: new Date(),
          },
        ],
      },
    },
  });
  console.log('✅ 2 conversations');

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
