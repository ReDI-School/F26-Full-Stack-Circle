import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * pill, 14px. Default = white bg, 1.5px border-input, tertiary text. Selected = tertiary
 * bg, white bold text.
 */
export const categoryChipStyles = tv({
  base: ['rounded-pill', 'py-2.5', 'px-4.5', 'cursor-pointer','border-[1.5px]', 'border-solid','text-sm'],
  variants: {
    selected: {
      false: [
        'bg-surface',
        'border-input',
        'font-medium', 'text-tertiary'],
      true: [
        'bg-tertiary',
        'border-tertiary',
        'font-bold', 'text-surface']
    },
    defaultVariants: {
      selected: false,
    },
  },
});
