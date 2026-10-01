import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * pill shape, brand-colored circle, initials centred in the display font. Sizes: sm
 * 32px, md 44px, lg 64px.
 */
export const avatarStyles = tv({
  base: ['rounded-pill', 'bg-primary', 'text-tertiary'],
  variants: {
    size: {
      sm: ['w-8 h-8 text-sm'],
      md: ['w-11 h-11 text-md'],
      lg: ['w-16 h-16 text-lg'],
    },
  },
});
