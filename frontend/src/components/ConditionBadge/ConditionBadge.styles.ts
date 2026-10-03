import { tv } from 'tailwind-variants';

export const conditionBadgeStyles = tv(
  {
    base: [
      'inline-flex',
      'items-center',
      'justify-center',
      'py-1.5',
      'px-3.5',
      'rounded-pill',
      'font-bold',
    ],
    variants: {
      variant: {
        NEW: ['bg-secondary-100', 'text-danger-text'],
        LIKE_NEW: ['bg-primary-100', 'text-primary-700'],
        GOOD: ['bg-tertiary-100', 'text-tertiary'],
        USED: ['bg-bg', 'text-muted', 'border', 'border-border'],
      },
      size: {
        sm: ['py-1', 'px-2.5', 'text-2xs'],
        md: ['py-1.5', 'px-3.5', 'text-caption'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
  {
    twMergeConfig: {
      classGroups: {
        // Register custom font-size tokens so tailwind-merge knows they belong
        // to the fontSize group and won't conflict with text-color utilities.
        'font-size': [{ text: ['2xs', 'caption', 'body', 'h1', 'h2', 'display'] }],
      },
    },
  }
);
