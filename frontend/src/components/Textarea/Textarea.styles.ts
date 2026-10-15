import { tv } from 'tailwind-variants';

import { textFieldStyles } from '../TextField/TextField.styles';

export const textareaStyles = tv({
  extend: textFieldStyles,
  slots: {
    input: ['py-3', 'resize-y'],
    message: [
      'h-[2lh]',
      'shrink-0',
      'overflow-y-auto',
      'overflow-x-hidden',
      'break-words',
      'font-sans',
      'text-[length:var(--text-caption)]',
    ],
    helper: ['font-sans', 'text-[length:var(--text-caption)]', 'text-muted'],
  },
  variants: {
    disabled: {
      true: {
        input: ['opacity-50', 'cursor-not-allowed'],
      },
    },
  },
});
