import { tv } from 'tailwind-variants';

export const footerStyles = tv({
  slots: {
    root: 'bg-surface border-t border-border',
    inner:
      'mx-auto grid max-w-[1076px] grid-cols-2 gap-6 px-8 py-10 min-[800px]:grid-cols-[1.4fr_1fr_1fr_1fr]',
    brand: 'flex flex-col gap-3',
    description: 'max-w-[240px] text-caption leading-relaxed text-muted',
    heading: 'mb-3 font-display text-sm font-extrabold text-ink',
    list: 'flex flex-col gap-2',
    link: 'text-sm text-primary-hover transition-colors hover:text-secondary',
  },
});
