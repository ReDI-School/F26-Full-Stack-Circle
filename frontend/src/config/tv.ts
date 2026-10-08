import { createTV } from 'tailwind-variants';

// tailwind-merge doesn't read global.css, so it doesn't know our custom
// font-size tokens and treats them as colours (e.g. removes text-white).
// Keep this list in sync with the --text-* tokens in global.css.
export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        'font-size': [{ text: ['caption', 'body', 'h2', 'h1', 'display'] }],
      },
    },
  },
});