import type { StorybookConfig } from '@storybook/react-vite';

// Storybook is deployed under /storybook, so its bundled assets have to be
// requested from there rather than from the site root. Vercel sets this in
// vercel.json; `pnpm storybook` and `pnpm build-storybook` are unaffected.
const basePath = process.env.STORYBOOK_BASE_PATH;

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    const tailwindcss = await import('@tailwindcss/vite');
    config.plugins = [...(config.plugins || []), tailwindcss.default()];

    if (basePath) {
      config.base = basePath;
    }

    return config;
  },
};
export default config;
