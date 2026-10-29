import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'api',
          environment: 'node',
          include: ['src/config/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'hooks',
          include: ['src/hooks/**/*.test.tsx', 'src/app/**/*.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
