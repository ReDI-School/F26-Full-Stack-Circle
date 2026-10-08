import { tv } from 'tailwind-variants';

export const threadListStyles = tv({
  slots: {
    root: 'border border-border rounded-cart overflow-hidden w-[340px] bg-surface',
    row: 'last:border-b-0 border-b border-bg hover:bg-bg aria-current:bg-bg',
    button: 'flex cursor-pointer px-4.5 py-4 flex-col w-full h-full gap-[3px] items-start',
    headerRow: 'flex flex-row justify-between items-center w-full',
    itemTitle: 'min-w-0 text-[12px] font-bold text-[var(--color-title)] ',
    withName: 'font-display text-[14px] font-extrabold',
    unreaddot: 'w-2 h-2 rounded-full bg-secondary inline-block ml-1',
    time: 'ml-auto text-placeholder text-[11px] shrink-0',
    lastMessage: 'min-w-0 truncate text-left w-full text-muted text-caption',
  },
  variants: {
    active: {
      true: {
        row: 'bg-bg',
      },
    },
  },
  defaultVariants: {
    unread: false,
    active: false,
  },
});
