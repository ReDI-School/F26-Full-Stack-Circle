import path from 'path';
import { fileURLToPath } from 'url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolve = {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
};

export default defineConfig({
  resolve,
  test: {
    projects: [
      {
        resolve,
        test: {
          name: 'api',
          environment: 'node',
          include: ['src/config/**/*.test.ts', 'src/lib/**/*.test.ts'],
        },
      },
      {
        resolve,
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
