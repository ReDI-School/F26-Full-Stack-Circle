import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * dark ink pill, radius 14, white 14px text, with an 8px dot on the left: green for
 * success, secondary for error.
 */

export const toastStyles = tv({
  slots: {
    base: [
      'fixed',
      'bottom-7',
      'left-1/2',
      '-translate-x-1/2',
      'z-[60]',
      'flex',
      'items-center',
      'gap-3',
      'max-w-[calc(100vw-2rem)]',
      'sm:max-w-md',
      'w-auto',
      'rounded-[14px]',
      'bg-ink',
      'px-5',
      'py-3',
      'text-sm',
      'font-medium',
      'leading-snug',
      'text-white',
      'shadow-[0_10px_30px_rgba(34,52,58,.3)]',
    ],
    dot: ['h-2', 'w-2', 'min-w-2', 'shrink-0', 'rounded-full'],
  },

  variants: {
    variant: {
      success: {
        dot: 'bg-success',
      },
      error: {
        dot: 'bg-secondary',
      },
    },
  },

  defaultVariants: {
    variant: 'success',
  },
});
