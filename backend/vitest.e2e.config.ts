import { defineConfig } from 'vitest/config';

// End-to-end tests: a real PostgreSQL, the real backend started with
// `tsx src/index.ts`, and real HTTP requests. Nothing is mocked.
export default defineConfig({
  test: {
    include: ['e2e/**/*.e2e.test.ts'],
    globalSetup: ['e2e/globalSetup.ts'],
    // All files share one database and one server, so run them one at a time.
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 120_000,
  },
});
