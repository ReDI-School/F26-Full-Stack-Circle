import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

import { PrismaClient } from '../../generated/prisma/client.js';
import { relaxSslVerification } from './databaseUrl';

dotenv.config();

// Prisma 7 talks to the database through a driver adapter.
//
// POSTGRES_PRISMA_URL is the pooled connection, meant for queries at
// runtime. The same variable names are used locally, in preview and in
// production -- see .env.example.
const connectionString = relaxSslVerification(process.env.POSTGRES_PRISMA_URL);

if (!connectionString) {
  throw new Error(
    'POSTGRES_PRISMA_URL is not set. Copy .env.example to .env and start the database with `pnpm db:up`.'
  );
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;
