import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * always a pill (rounded-pill), display font weight 800. primary = secondary color bg,
 * secondary = tertiary bg, ghost = 2px tertiary border, danger = secondary-100 bg with
 * danger text, outlineLight = white border for colored backgrounds. Hover darkens ~8%.
 */
export const buttonStyles = tv({
  base: [
    'rounded-pill',
    'font-extrabold',
    'cursor-pointer',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-2',
    'focus-visible:outline-tertiary',
  ],
  variants: {
    variant: {
      primary: [
        'bg-secondary',
        'text-white',
        'hover:bg-secondary-hover',
        'disabled:bg-border',
        'disabled:border-border',
        'disabled:text-placeholder',
        'disabled:cursor-not-allowed',
      ],
      secondary: [
        'bg-tertiary',
        'text-white',
        'hover:bg-tertiary-hover',
        'disabled:bg-border',
        'disabled:border-border',
        'disabled:text-placeholder',
        'disabled:cursor-not-allowed',
      ],
      ghost: [
        'bg-transparent',
        'text-tertiary',
        'border-2',
        'border-tertiary',
        'hover:bg-tertiary-100',
        'disabled:bg-border',
        'disabled:border-border',
        'disabled:text-placeholder',
        'disabled:cursor-not-allowed',
      ],
      danger: [
        'bg-secondary-100',
        'text-danger-text',
        'hover:bg-secondary-100-hover',
        'disabled:bg-border',
        'disabled:border-border',
        'disabled:text-placeholder',
        'disabled:cursor-not-allowed',
      ],
      outlineLight: [
        'bg-transparent',
        'text-white',
        'border-2',
        'border-white',
        'hover:bg-white/15',
        'disabled:bg-border',
        'disabled:border-border',
        'disabled:text-placeholder',
        'disabled:cursor-not-allowed',
      ],
    },
    size: {
      sm: ['py-2.5', 'px-4.5', 'text-[.8125rem]'],
      md: ['py-3.5', 'px-6.5', 'text-[.9375rem]'],
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
