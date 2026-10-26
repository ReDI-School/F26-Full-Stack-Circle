import { tv } from '../../config/tv';

/**
 * Below 800px the row wraps and the search field moves to its own full-width
 * line (`max-[800px]:` is Tailwind's "narrower than 800px" variant).
 */
export const navbarStyles = tv({
  slots: {
    root: [
      'sticky',
      'top-0',
      'z-20',
      'w-full',
      'bg-surface',
      'border-b',
      'border-border',
      'shadow-nav',
    ],

    inner: [
      'mx-auto',
      'flex',
      'max-w-[1076px]',
      'items-center',
      'gap-[18px]',
      'py-3',
      'px-5',
      'max-[800px]:flex-wrap',
    ],

    logoButton: [
      'flex',
      'shrink-0',
      'cursor-pointer',
      'rounded-input',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-tertiary',
    ],

    search: [
      'w-[220px]',
      'rounded-pill',
      'bg-bg',
      'py-2.5',
      'px-5',
      'font-sans',
      'text-[14px]',
      'text-ink',
      'placeholder:text-placeholder',
      'outline-none',
      'transition-shadow',
      'duration-150',
      'focus:ring-[3px]',
      'focus:ring-primary-100',
      'max-[800px]:order-9',
      'max-[800px]:w-full',
    ],

    actions: ['ml-auto', 'flex', 'shrink-0', 'items-center', 'gap-3'],

    inbox: [
      'relative',
      'flex',
      'size-[38px]',
      'shrink-0',
      'cursor-pointer',
      'items-center',
      'justify-center',
      'rounded-pill',
      'bg-bg',
      'text-tertiary',
      'hover:bg-tertiary-100',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-tertiary',
    ],

    badge: [
      'absolute',
      '-top-[3px]',
      '-right-[3px]',
      'flex',
      'h-[17px]',
      'min-w-[17px]',
      'items-center',
      'justify-center',
      'rounded-pill',
      'bg-secondary',
      'px-1',
      'font-sans',
      'text-[10px]',
      'leading-none',
      'font-bold',
      'text-white',
    ],
  },
});
