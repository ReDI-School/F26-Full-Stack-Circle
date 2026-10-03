import { tv } from 'tailwind-variants';

export const avatarStyles = tv({
  base: [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-pill',
    'text-white',
    'font-display',
    'font-extrabold',
    'overflow-hidden',
  ],

  variants: {
    size: {
      sm: ['w-8', 'h-8', 'text-caption'],
      md: ['w-11', 'h-11', 'text-[16px]'],
      lg: ['w-16', 'h-16', 'text-h2'],
    },

  colours: {
      'bg-primary': 'bg-primary',
      'bg-secondary': 'bg-secondary',
      'bg-tertiary': 'bg-tertiary',
},

  },

  defaultVariants: {
    size: 'md',
  },
});