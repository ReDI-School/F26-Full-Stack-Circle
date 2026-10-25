import { tv } from '../../config/tv';

export const avatarMenuStyles = tv({
  slots: {
    root: ['relative', 'inline-block', 'h-fit'],

    trigger: [
      'rounded-pill',
      'cursor-pointer',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-tertiary',
    ],

    panel: [
      'absolute',
      'top-full',
      'right-0',
      'mt-2',
      'z-10',
      'flex',
      'flex-col',
      'gap-0.5',
      'w-[200px]',
      'p-2',
      'bg-surface',
      'border',
      'border-border',
      'rounded-[16px]',
      'shadow-menu',
    ],
    item: [
      'flex',
      'w-full',
      'items-center',
      'gap-1.5',
      'py-2.5',
      'px-3.5',
      'rounded-[10px]',
      'text-[14px]',
      'font-bold',
      'text-left',
      'cursor-pointer',
      'hover:bg-bg',
      'focus-visible:bg-bg',
      'focus-visible:outline-none',
    ],

    divider: ['h-px', 'bg-border', 'mx-2', 'my-1'],
  },

  variants: {
    danger: {
      true: { item: 'text-danger-text' },
      false: { item: 'text-tertiary' },
    },
  },

  defaultVariants: {
    danger: false,
  },
});
