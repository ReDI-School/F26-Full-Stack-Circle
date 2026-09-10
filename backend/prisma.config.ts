import 'dotenv/config';

import { defineConfig } from 'prisma/config';

// Falls back to the database defined in docker-compose.yml, so a fresh
// clone can run `prisma generate` before you have created your .env file.
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://redi:redi@localhost:5434/redicycle';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
