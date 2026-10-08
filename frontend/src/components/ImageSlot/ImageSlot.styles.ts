import { tv } from 'tailwind-variants';

export const imageSlotStyles = tv({
  base: 'relative font-mono text-placeholder',
  variants: {
    shape: {
      circle: 'rounded-pill aspect-square !h-auto',
      rounded: 'rounded-[16px]',
    },
    empty: {
      true: 'border-[1.5px] border-dashed border-border-input flex flex-col gap-2 justify-center items-center bg-muted/10',
    },
  },
});
