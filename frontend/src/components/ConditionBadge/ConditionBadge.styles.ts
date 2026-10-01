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
    base: ['py-1.5', 'px-3.5', 'rounded-pill', 'font-bold'],
    variants: {
      variant: {
        new: ['bg-secondary-100', 'text-danger-text'],
        'like-new': ['bg-primary-100', 'text-primary-200'],
        good: ['bg-tertiary-100', 'text-tertiary'],
        used: ['bg-bg', 'text-muted', 'border', 'border-border'],
      },
      size: {
        sm: ['py-1', 'px-2.5'],
        md: ['py-1.5', 'px-3.5', 'text-caption'],
      },
    },
    defaultVariants: {
      variant: 'new',
      size: 'md',
    },
  },
  { twMerge: false }
);
