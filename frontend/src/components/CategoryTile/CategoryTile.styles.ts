import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * pill with a 34px white circle holding the emoji, then the name in display 800.
 * Background cycles the 100-tints. Selected = tertiary bg, white text. Hover lifts 2px.
 */
export const categoryTileStyles = tv({
  base: 'inline-flex cursor-pointer items-center gap-3 rounded-pill border-[1.5px] border-transparent py-[10px] pr-[20px] pl-[12px] font-display font-extrabold text-tertiary transition-transform hover:-translate-y-0.5 hover:shadow-card transition-[transform,box-shadow]',
  variants: {
    tint: {
      primary: 'bg-primary-100',
      secondary: 'bg-secondary-100',
      tertiary: 'bg-tertiary-100',
    },
    selected: {
      true: 'bg-tertiary text-white',
      false: '',
    },
  },
  defaultVariants: {
    tint: 'primary',
    selected: false,
  },
});
