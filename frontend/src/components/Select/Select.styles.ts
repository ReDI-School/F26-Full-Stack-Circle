import { tv } from 'tailwind-variants';

export const wrapperStyles = tv({
  base: ['w-full flex flex-col gap-1.5'],
});

export const labelStyles = tv({
  base: ['font-sans font-bold text-body text-ink'],
});

export const selectStyles = tv({
  base: [
    'w-full bg-white py-3 px-3 font-sans text-body text-ink rounded-input border-[1.5px] border-border-input placeholder:text-placeholder outline-none transition-all duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary-100 cursor-pointer',
  ],
  variants: {
    error: {
      true: 'border-secondary focus:border-secondary focus:ring-secondary-100',
      false: '',
    },
  },
  defaultVariants: {
    error: false,
  },
});

export const errorStyles = tv({
  base: 'font-sans text-caption text-secondary',
});
