import { tv } from 'tailwind-variants';

export const categoryChipStyles = tv({
  base: [
    'rounded-pill',
    'py-2.5',
    'px-4.5',
    'cursor-pointer',
    'border-[1.5px]',
    'border-solid',
    'text-sm',
  ],
  variants: {
    selected: {
      false: ['bg-surface', 'border-input', 'font-medium', 'text-tertiary'],
      true: ['bg-tertiary', 'border-tertiary', 'font-bold', 'text-surface'],
    },
    defaultVariants: {
      selected: false,
    },
  },
});
