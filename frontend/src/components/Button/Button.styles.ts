import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
  base: [
    'rounded-pill',
    'font-display',
    'font-extrabold',
    'cursor-pointer',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-2',
    'focus-visible:outline-tertiary',
    'disabled:bg-border',
    'disabled:border-border',
    'disabled:text-placeholder',
    'disabled:cursor-not-allowed',
  ],
  variants: {
    variant: {
      primary: ['bg-secondary', 'text-white', 'hover:bg-secondary-hover'],
      secondary: ['bg-tertiary', 'text-white', 'hover:bg-tertiary-hover'],
      ghost: [
        'bg-transparent',
        'text-tertiary',
        'border-2',
        'border-tertiary',
        'hover:bg-tertiary-100',
      ],
      danger: ['bg-secondary-100', 'text-danger-text', 'hover:bg-secondary-100-hover'],
      outlineLight: [
        'bg-transparent',
        'text-white',
        'border-2',
        'border-white',
        'hover:bg-white/15',
      ],
    },
    size: {
      sm: ['py-2.5', 'px-4.5', 'text-[length:var(--text-caption)]'],
      md: ['py-3.5', 'px-6.5', 'text-[length:var(--text-body)]'],
    },
    stretch: {
      true: ['w-full'],
      false: [],
    },
  },
  compoundVariants: [
    //ghost + sm
    {
      variant: 'ghost',
      size: 'sm',
      class: 'py-2 px-4',
    },

    //ghost + md
    {
      variant: 'ghost',
      size: 'md',
      class: 'py-3 px-6',
    },

    // outlineLight + sm
    {
      variant: 'outlineLight',
      size: 'sm',
      class: 'py-2 px-4',
    },

    // outlineLight + md
    {
      variant: 'outlineLight',
      size: 'md',
      class: 'py-3 px-6',
    },
  ],

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    stretch: false,
  },
});
