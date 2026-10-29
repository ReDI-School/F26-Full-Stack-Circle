import { tv } from '@/config/tv';

/**
 * No background here: global.css already sets bg-bg on <body>.
 */
export const layoutStyles = tv({
  slots: {
    // At least the full viewport height, so the footer can sit at the bottom.
    // The navbar is a direct child of this column, so its own `sticky top-0`
    // keeps it on top for the whole page; Layout adds no sticky of its own.
    root: ['flex', 'min-h-screen', 'flex-col'],

    // flex-1 grows <main> to fill the leftover height, which keeps the footer
    // at the bottom of a short page instead of halfway up the screen
    main: ['flex', 'w-full', 'flex-1', 'flex-col'],

    content: ['mx-auto', 'w-full', 'max-w-[1140px]', 'px-8'],
  },
  variants: {
    variant: {
      default: {},
      // Login and register are full-height splits: no cap, no padding
      bare: {
        content: ['max-w-none', 'px-0', 'flex', 'flex-1', 'flex-col'],
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
