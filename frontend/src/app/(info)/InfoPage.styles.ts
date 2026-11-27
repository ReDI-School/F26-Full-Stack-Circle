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
      '[&>section:last-child]:mt-auto',
      '[&>section:last-child]:mb-0',
      '[&>section:last-child]:shrink-0',
    ],
    body: ['flex-1', 'w-full', 'max-w-[1140px]', 'mx-auto', 'py-7'],
  },
});
