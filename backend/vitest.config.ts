import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Same aliases as tsconfig.json, so `@/errors/...` resolves in tests too.
    alias: {
      '@generated': fileURLToPath(new URL('./generated', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // The e2e tests need a database and run with `pnpm test:e2e`.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    // Reset every vi.fn() between tests, so one test's fake answers
    // never leak into the next.
    mockReset: true,
  },
});
