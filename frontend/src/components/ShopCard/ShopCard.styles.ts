import { tv } from '../../config/tv';

export const shopCardStyles = tv({
  slots: {
    base: [
      'flex w-50 max-w-full min-w-0 flex-col items-center gap-2 p-5',
      'rounded-card border border-border bg-surface text-center text-ink',
    ],
    avatarWrapper: 'flex shrink-0',
    avatar: 'size-14 text-avatar',
    name: 'max-w-full truncate font-display text-body font-extrabold',
    itemCount: 'text-caption text-muted',
  },
  variants: {
    interactive: {
      true: {
        base: [
          'cursor-pointer transition-[transform,box-shadow] duration-200',
          'hover:-translate-y-0.5 hover:shadow-card',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        ],
      },
    },
  },
});
