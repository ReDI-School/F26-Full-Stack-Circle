import { tv } from 'tailwind-variants';

export const messageBubbleStyles = tv({
  slots: {
    base: 'rounded-[16px] py-2.5 px-[15px] text-[14px] leading-[1.5] max-w-[70%] border break-words whitespace-pre-wrap',
    timestamp: 'block mt-1 text-[11px]',
  },
  variants: {
    own: {
      true: {
        base: 'self-end bg-tertiary border-tertiary text-white',
        timestamp: 'text-white/70',
      },
      false: {
        base: 'self-start bg-white border-border text-ink',
        timestamp: 'text-placeholder',
      },
    },
  },
  defaultVariants: {
    own: false,
  },
});