import { tv } from 'tailwind-variants';

export const logo = tv({
  base: 'inline-flex items-center gap-2 select-none',
});

export const wordmark = tv({
  base: 'font-display font-black tracking-tight text-ink',
  variants: {
    size: {
      sm: 'text-base',
      md: 'text-xl',
      lg: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
