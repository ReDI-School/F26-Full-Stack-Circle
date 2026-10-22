import { tv } from '../../config/tv';
export const shopCardStyles = tv({
  slots: {
    base: [
      'flex',
      'flex-col',
      'items-center',
      'gap-2',
      'p-5',
      'bg-white',
      'border',
      'border-border',
      'rounded-card',
      'text-center',
      'cursor-pointer',
      'transition-transform',
      'duration-200',
      'hover:-translate-y-0.5',
      'hover:shadow-card',
      'w-[200px]'
    ],
    name: ['font-display', 'font-extrabold', 'text-[15px]'],
    itemCount: ['text-muted', 'text-[13px]'],
  },
});
