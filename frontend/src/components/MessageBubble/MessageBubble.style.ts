import { tv } from 'tailwind-variants';

export const messageBubbleStyles = tv({

  base: 'rounded-[16px] py-2.5 px-[15px] text-[14px] leading-[1.5] max-w-[70%] border',

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