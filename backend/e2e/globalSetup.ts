import { type ChildProcess, execSync, spawn } from 'node:child_process';

import { PrismaPg } from '@prisma/adapter-pg';
import type { TestProject } from 'vitest/node';

import { PrismaClient } from '../generated/prisma/client';

// A separate database next to your dev one, in the same Docker container
// (`pnpm db:up`). It is wiped on every run, so it must never be the
// database you develop against. Override with E2E_DATABASE_URL.
const DATABASE_URL =
  process.env.E2E_DATABASE_URL ?? 'postgres://redi:redi@localhost:5434/redicycle_e2e';
const PORT = 4100;
const API_URL = `http://localhost:${PORT}/api`;

declare module 'vitest' {
  export interface ProvidedContext {
    apiUrl: string;
    databaseUrl: string;
  }
}

let server: ChildProcess | undefined;

const createDatabaseIfMissing = async () => {
  const url = new URL(DATABASE_URL);
  const name = url.pathname.slice(1);

  // A guard against pointing this at real data by accident.
  if (!/e2e|test/.test(name)) {
    throw new Error(
      `Refusing to wipe "${name}": the e2e database name must contain "e2e" or "test".`
    );
  }

  // Connect to the built-in "postgres" database to create ours.
  url.pathname = '/postgres';
  const admin = new PrismaClient({ adapter: new PrismaPg({ connectionString: url.toString() }) });
  const rows = await admin.$queryRaw<unknown[]>`SELECT 1 FROM pg_database WHERE datname = ${name}`;
  if (rows.length === 0) await admin.$executeRawUnsafe(`CREATE DATABASE "${name}"`);
  await admin.$disconnect();
};

const waitForApi = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (res.ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`The backend did not answer on ${API_URL}/health within 15 seconds.`);
};

export default async function setup(project: TestProject) {
  await createDatabaseIfMissing();

  const env = {
    ...process.env,
    POSTGRES_PRISMA_URL: DATABASE_URL,
    POSTGRES_URL_NON_POOLING: DATABASE_URL,
    JWT_SECRET: 'e2e-only-secret-not-used-anywhere-else',
    PORT: String(PORT),
    NODE_ENV: 'test',
  };

  // The same steps CI and Vercel run: empty database, every committed
  // migration, then the seed. So the tests see exactly what a fresh
  // preview sees.
  execSync('prisma migrate reset --force', { env, stdio: 'inherit' });
  execSync('tsx prisma/seed.ts', { env, stdio: 'inherit' });

  server = spawn('tsx', ['src/index.ts'], { env, stdio: 'inherit' });
  await waitForApi();

  project.provide('apiUrl', API_URL);
  project.provide('databaseUrl', DATABASE_URL);

  return () => {
    server?.kill();
  };
}
