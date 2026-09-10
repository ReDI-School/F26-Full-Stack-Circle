const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'generated/', 'dist/', 'build/', 'coverage/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
