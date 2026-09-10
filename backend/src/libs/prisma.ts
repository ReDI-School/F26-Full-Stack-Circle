import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client.js';

// Prisma 7 talks to the database through a driver adapter.
// The connection string comes from DATABASE_URL (see .env.example).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
