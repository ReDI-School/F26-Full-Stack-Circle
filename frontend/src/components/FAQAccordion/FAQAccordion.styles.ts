import { tv } from 'tailwind-variants';

export const baseStyles = tv({
  base: 'w-full flex flex-col gap-3',
});

export const cardStyles = tv({
  base: 'w-full bg-white border border-border rounded-2xl overflow-hidden',
});

export const buttonStyles = tv({
  base: 'w-full flex items-center justify-between py-4.5 px-6 cursor-pointer select-none hover:bg-bg',
});

export const questionStyles = tv({
  base: 'font-display font-extrabold text-base',
});

export const chevronStyles = tv({
  base: 'font-display font-black text-lg text-primary',
  defaultVariants: {
    open: false,
  },
});

export const answerStyles = tv({
  base: 'px-6 pb-5 text-sm leading-1.65 text-body',
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
