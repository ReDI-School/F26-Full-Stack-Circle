import { tv } from 'tailwind-variants';

export const confirmDialogStyles = tv({
  slots: {
    backdrop: ['fixed inset-0 z-50 flex items-center justify-center bg-[rgba(34,52,58,.45)]'],
    dialog: [
      'flex w-[90%] max-w-[380px] flex-col gap-2.5 rounded-[24px] bg-white p-7',
      'text-ink shadow-[0_20px_48px_rgba(34,52,58,.3)]',
    ],
    title: ['font-display text-[20px] font-extrabold'],
    description: ['text-[14px] leading-[1.55] text-body'],
    actions: ['mt-2 flex items-center justify-end gap-2.5'],
  },
});
