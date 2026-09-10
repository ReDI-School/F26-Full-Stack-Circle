import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import { globalIgnores } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores(['.next', 'node_modules', 'storybook-static']),
  js.configs.recommended,
  tseslint.configs.recommended,
  nextCoreWebVitals,
  nextTypescript,
  storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
]);
