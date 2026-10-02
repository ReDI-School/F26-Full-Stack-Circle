import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * small pill, 13px bold. new = secondary-100/danger text, like-new =
 * primary-100/#2e7d96, good = tertiary-100/tertiary, used = bg/muted with a border.
 */
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
        new: ['bg-secondary-100', 'text-danger-text'],
        'like-new': ['bg-primary-100', 'text-primary-200'],
        good: ['bg-tertiary-100', 'text-tertiary'],
        used: ['bg-bg', 'text-muted', 'border', 'border-border'],
      },
      size: {
        small: ['py-1', 'px-2.5', 'text-2xs', 'leading-[1.308]'],
        medium: ['py-1.5', 'px-3.5', 'text-caption', 'leading-[1.416]'],
      },
    },
    defaultVariants: {
      variant: 'new',
      size: 'medium',
    },
  },
  { twMerge: false }
);
