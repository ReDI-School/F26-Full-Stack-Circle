'use client';

import { useEffect, useRef } from 'react';
import { toastStyles } from './Toast.styles';
import type { ToastProps } from './Toast.types';
import { createPortal } from 'react-dom';

const Toast = ({ message, variant = 'success', duration = 4000, open, onDismiss }: ToastProps) => {
  const styles = toastStyles({ variant });
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = window.setTimeout(() => {
      onDismissRef.current?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [open, duration]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={styles.base()}
      role="status"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className={styles.dot()} aria-hidden="true" />
      <span className="min-w-0 break-words">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={() => onDismissRef.current?.()}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}{' '}
    </div>,
    document.body
  );
};

export default Toast;
