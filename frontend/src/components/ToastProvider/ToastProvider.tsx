'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext, type ToastApi } from '../../hooks/useToast';
import { Toast } from '../Toast';
import type { ToastProviderProps } from './ToastProvider.types';

type Notification = { id: number; message: string; variant: 'success' | 'error' };

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const nextId = useRef(0);

  const show = useCallback((message: string, variant: Notification['variant']) => {
    setNotification({ id: nextId.current++, message, variant });
  }, []);

  const toast = useMemo<ToastApi>(
    () => ({
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error'),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {notification && (
        <Toast
          // Remount even for identical messages so every notification gets 3.2 seconds.
          key={notification.id}
          open
          message={notification.message}
          variant={notification.variant}
          duration={3200}
          onDismiss={() =>
            setNotification((current) => (current?.id === notification.id ? null : current))
          }
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
