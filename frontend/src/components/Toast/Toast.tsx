import { toastStyles } from './Toast.styles';
import type { ToastProps } from './Toast.types';

const Toast = ({ message, variant = 'success', onDismiss }: ToastProps) => {
  const styles = toastStyles({ variant });

  return (
    <div
      className={styles.base()}
      role="status"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {' '}
      <span className={styles.dot()} aria-hidden="true" />
      <span className="break-words">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
          ×
        </button>
      )}{' '}
    </div>
  );
};
export default Toast;
