import { tv } from 'tailwind-variants';

export const emptyStateStyles = tv({
  slots: {
    container: [
      'flex',
      'flex-col',
      'w-full',
      'items-center',
      'gap-2',
      'text-center',
      'px-5',
      'py-15',
    ],
    emoji: ['text-[40px]', 'leading-none'],
    title: ['font-display', 'text-xl', 'font-extra-bold', 'text-tertiary'],
    description: ['text-sm', 'text-muted'],
    action: ['mt-2', 'max-w-full'],
  },
  variants: {
    variant: {
      plain: [''],
      boxed: {
        container: [
          'rounded-[24px]',
          'border-[1.5px]',
          'border-dashed',
          'border-border-input',
          'bg-surface',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'plain',
  },
});
