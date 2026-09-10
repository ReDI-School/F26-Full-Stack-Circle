import { tv } from 'tailwind-variants';

export const logoStyles = tv({
  base: 'inline-flex items-center gap-2 select-none',
});

export const wordmarkStyles = tv({
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
