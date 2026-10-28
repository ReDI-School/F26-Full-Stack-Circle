import { tv } from '../../config/tv';

/**
 * Below 800px the row wraps and the search field moves to its own full-width
 * line (`max-[800px]:` is Tailwind's "narrower than 800px" variant).
 * Below 400px the logo drops its wordmark: logo + wordmark + actions don't fit
 * on one line there, and the actions must stay on the first line.
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

    logoFull: ['flex', 'max-[400px]:hidden'],

    logoMark: ['hidden', 'max-[400px]:flex'],

    // The form is the flex item, so it carries the width and the mobile line break
    searchForm: ['w-[220px]', 'max-[800px]:order-9', 'max-[800px]:w-full'],

    search: [
      'w-full',
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

    /**
     * AvatarMenu renders a 32px avatar and opens its panel 8px under it. The
     * spec wants 38x38 here, and the panel must not cover the bar's bottom edge.
     * Both are set from the Navbar, so AvatarMenu itself stays unchanged:
     * the avatar is the <span> inside the menu trigger, the panel has role="menu".
     */
    avatar: ['flex', '[&_[aria-haspopup=menu]>span]:size-[38px]', '[&_[role=menu]]:mt-5'],

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
