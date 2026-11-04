'use client';

import { createContext, useContext } from 'react';

export type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);

const useToast = (): ToastApi => {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error('useToast must be used inside ToastProvider.');
  return toast;
};

export default useToast;
