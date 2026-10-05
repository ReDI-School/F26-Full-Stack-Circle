
import { tv } from 'tailwind-variants';

export const messageBubbleStyles = tv({
  
  base: 'rounded-[16px] py-2.5 px-[15px] text-[14px] leading-[1.5] max-w-[70%] border break-words whitespace-pre-wrap',
  
  variants: {
    own: {
      
      true: 'self-end bg-tertiary border-tertiary text-white',

      false: 'self-start bg-white border-border text-ink',
    },
  },
  defaultVariants: {

    own: false,

  },
});

export const messageBubbleTimestampStyles = tv({

  base: 'block mt-1 text-[11px]',
  
  variants: {
  
    own: {
  
      true: 'text-white/70',
      false: 'text-placeholder',
  
    },
  },

  defaultVariants: {

    own: false,

  },
});