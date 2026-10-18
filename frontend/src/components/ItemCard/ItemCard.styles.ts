import { tv } from 'tailwind-variants';

/**
 * TODO: style the component with the design tokens from
 * src/assets/css/global.css (bg-primary, text-tertiary, rounded-pill, ...).
 *
 * white card, radius-card, border. 180px photo area on top with the condition badge at
 * top-left, then title (display 800, 17px), 'category · seller' in muted 13px, and the
 * price in display black 20px secondary. Hover lifts 2px with shadow-card.
 */

export const itemCardStyles = tv({
  slots: {
    base: [
      'group',
      'block',
      'w-full',
      'min-w-0',
      'overflow-hidden',
      'rounded-card',
      'border',
      'border-border',
      'bg-surface',
      'text-left',
      'cursor-pointer',
      'transition-[box-shadow,transform]',
      'duration-150',
      'hover:-translate-y-0.5',
      'hover:shadow-card',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-secondary',
      'focus-visible:ring-offset-2',
    ],
    photo: [
      'relative',
      'w-full',
      'overflow-hidden',
      'bg-[repeating-linear-gradient(45deg,theme(colors.surface)_0,theme(colors.surface)_10px,theme(colors.border)_10px,theme(colors.border)_20px)]',
    ],
    image: [
      'absolute',
      'inset-0',
      'h-full',
      'w-full',
      'object-cover',
      'transition-transform',
      'duration-150',
      'group-hover:scale-[1.02]',
    ],
    placeholder: [
      'absolute',
      'inset-0',
      'flex',
      'items-center',
      'justify-center',
      'font-mono',
      'text-sm',
      'text-muted',
      'lowercase',
    ],
    condition: ['absolute', 'left-3', 'top-3', 'z-10'],
    soldOverlay: [
      'absolute',
      'inset-0',
      'z-20',
      'flex',
      'items-center',
      'justify-center',
      'bg-[rgba(34,52,58,0.55)]',
      'font-display',
      'text-lg',
      'font-black',
      'tracking-[3px]',
      'text-white',
    ],
    body: 'flex min-w-0 flex-col gap-1.5 p-4',
    title: ['font-display', 'text-base', 'font-extrabold', 'leading-snug'],
    meta: ['text-[13px]', 'leading-snug', 'text-muted'],
    priceRow: 'flex flex-wrap items-baseline gap-2',
    price: ['font-display', 'text-secondary', 'font-black', 'leading-tight', 'tabular-nums'],
    oldPrice: [
      'font-display',
      'text-[0.65em]',
      'font-normal',
      'text-placeholder',
      'line-through',
      'leading-tight',
      'tabular-nums',
    ],
  },
  variants: {
    size: {
      sm: {
        photo: 'h-[150px]',
        body: 'gap-1.5 p-3',
        title: 'truncate whitespace-nowrap text-base',
        meta: 'truncate text-[13px]',
        price: 'text-[18px]',
      },
      md: {
        photo: 'h-[176px]',
        title: 'text-[17px]',
        price: 'text-[20px]',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
