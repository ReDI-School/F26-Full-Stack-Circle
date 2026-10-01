import { tv } from 'tailwind-variants';

export const textFieldStyles = tv({
  slots: {
    root: ['flex', 'w-full', 'flex-col', 'gap-1.5'],
    label: ['font-sans', 'font-bold', 'text-body', 'text-ink'],
    input: [
      'w-full',
      'px-4',
      'py-2.5',
      'font-sans',
      'text-body',
      'text-ink',
      'bg-surface',
      'rounded-input',
      'border-[1.5px]',
      'border-border-input',
      'placeholder:text-placeholder',
      'outline-none',
      'transition-all',
      'duration-150',
      'focus:border-primary',
      'focus:ring-[3px]',
      'focus:ring-primary-100',
    ],
    error: ['font-sans', 'text-caption', 'text-secondary'],
  },
  variants: {
    hasError: {
      true: {
        input: ['border-secondary', 'focus:border-secondary', 'focus:ring-secondary-100'],
      },
    },
  },
  defaultVariants: {
    hasError: false,
  },
});