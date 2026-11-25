import { tv } from '@/config/tv';

export const infoPageStyles = tv({
  slots: {
    root: [
      'flex',
      'flex-1',
      'flex-col',
      'w-full',
      'min-w-0',
      'mb-0',
      '[&>section:first-child_h1]:text-[38px]',
      '[&>section:first-child_p]:max-w-none',
      '[&>section:first-child_p]:text-[#eaf6fa]',
    ],
    body: ['flex-1', 'w-full', 'max-w-[1140px]', 'mx-auto', 'px-6', 'sm:px-8', 'py-7'],
  },
});
