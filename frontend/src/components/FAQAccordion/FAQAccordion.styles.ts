import { tv } from 'tailwind-variants';

export const baseStyles = tv({
  base: 'w-full flex flex-col gap-3',
});

export const cardStyles = tv({
  base: 'w-full bg-white border border-border rounded-[16px] overflow-hidden',
});

export const buttonStyles = tv({
  base: 'w-full flex items-center justify-between gap-4 py-4.5 px-6 cursor-pointer select-none hover:bg-bg[var(--color-bg)] transition-colors duration-200',
});

export const questionStyles = tv({
  base: 'flex-1 text-left font-display font-extrabold text-base',
});

export const chevronStyles = tv({
  base: 'shrink-0 flex item-center justify-center font-display font-black text-lg text-primary transition-transform duration-200',
});

export const answerStyles = tv({
  base: 'px-6 pb-5 text-sm leading-[1.65] text-body',
  variants: {
    open: {
      true: 'block',
      false: 'hidden',
    },
  },
  defaultVariants: {
    open: false,
  },
});
