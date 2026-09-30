import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * small pill, 13px bold. new = secondary-100/danger text, like-new =
 * primary-100/#2e7d96, good = tertiary-100/tertiary, used = bg/muted with a border.
 */
export const conditionBadgeStyles = tv({
  base: ['py-1.5', 'px-3.5', 'rounded-pill'],
  variants: {
    variant: {
      new: ['bg-secondary-100', 'text-danger'],
      'like-new': ['bg-primary-100', 'text-primary-800'],
      good: ['bg-tertiary-100', 'text-tertiary-800'],
      used: ['bg-muted', 'border', 'border-muted'],
    },
    size: {
      sm: 'py-1 px-2.5',
      md: 'py-1.5 px-3.5',
    },
  },
});
