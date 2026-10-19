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
  'w-full',
  'box-border',
  'px-8',
  'min-[1076px]:px-[calc((100vw-1076px)/2)]',
],

  variants: {
    variant: {
      hero: [
        'bg-primary',
        'flex flex-col',
        'py-11',
      ],
      cta: [
        'bg-tertiary',
        'flex items-center justify-between',
        'gap-6',
        'py-10',
        'max-[799px]:flex-col',
        'max-[799px]:items-start',
      ],
    },
  },
});

export const bannerTitleStyles = tv({
  base: [
    'font-display',
    'font-black',
    'leading-[1.1]',
    'text-surface',
  ],
  variants: {
    variant: {
      hero: [
        'text-[42px]',
        'tracking-[-0.5px]',
        'max-w-[560px]',
      ],
      cta: ['text-[28px]'],
    },
  },
});

export const bannerSubtitleStyles = tv({
  base: [],
  variants: {
    variant: {
      hero: [
        'text-[16px]',
        'max-w-[480px]',
        'text-primary-100',
      ],
      cta: [
        'text-[15px]',
        'text-tertiary-100',
      ],
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
  base: ['ml-auto', 'shrink-0', 'max-[799px]:ml-0'],
});
