import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config();

// Schema changes and migrations need a direct connection, not the pooled
// one, so this uses POSTGRES_URL_NON_POOLING. Locally both point at the
// same Docker database; on Supabase they are genuinely different.
//
// The fallback keeps `prisma generate` working on a fresh clone, before
// anyone has created their .env file.
const directUrl = (
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_PRISMA_URL ??
  'postgres://redi:redi@localhost:5434/redicycle'
).replace('sslmode=require', 'sslmode=no-verify');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: directUrl,
  },
});
