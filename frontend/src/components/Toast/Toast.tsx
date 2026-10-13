'use client';

import { useEffect, useRef } from 'react';
import { toastStyles } from './Toast.styles';
import type { ToastProps } from './Toast.types';
import { createPortal } from 'react-dom';

const Toast = ({ message, variant = 'success', duration = 4000, open, onDismiss }: ToastProps) => {
  const styles = toastStyles({ variant });
  const onDissmissRef = useRef(onDismiss);

  useEffect(() => {
    onDissmissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = window.setTimeout(() => {
      onDissmissRef.current?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [open, duration, message]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={styles.base()}
      role="status"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className={styles.dot()} aria-hidden="true" />
      <span className="break-words">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={() => onDissmissRef.current?.()}
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
