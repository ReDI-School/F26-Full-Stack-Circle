import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * hero = primary bg, 26px display black title. cta = tertiary bg, 20px title, action
 * pushed to the right. Both full width, white text.
 */

export const bannerStyles = tv({
  base: [
  'box-border',
  'w-full',
  'max-w-full',
  'min-w-0',
  'px-8',
  'min-[1076px]:px-[max(32px,_calc((100vw_-_1076px)/2))]',
],
  variants: {
    variant: {
      hero: ['bg-primary', 'flex flex-col', 'py-11'],
      cta: [
  'bg-tertiary',
  'flex',
  'w-full',
  'min-w-0',
  'items-center',
  'justify-between',
  'gap-6',
  'py-10',
  'max-[800px]:flex-col',
  'max-[800px]:items-start',
],
    },
  },
});

export const bannerTitleStyles = tv({
  base: ['font-display', 'font-black', 'leading-[1.1]', 'text-surface'],
  variants: {
    variant: {
      hero: ['text-[42px]', 'tracking-[-0.5px]', 'max-w-none'],
      cta: ['text-[28px]'],
    },
  },
});

export const bannerDescriptionStyles = tv({
  base: [],
  variants: {
    variant: {
      hero: ['text-[16px]', 'max-w-none', 'text-primary-100'],
      cta: ['text-[15px]', 'text-tertiary-100'],
    },
  },
});

export const bannerContentStyles = tv({
  base: ['min-w-0'],
  variants: {
    variant: {
      hero: [],
      cta: ['flex flex-col gap-2'],
    },
  },
});

export const bannerActionStyles = tv({
  base: ['ml-auto', 'min-w-0', 'max-w-full', 'shrink-0', 'max-[800px]:ml-0'],
});
