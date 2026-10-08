interface ToastProps {
  message: string;
  variant?: 'success' | 'error';

  onDismiss?: () => void;
}

export type { ToastProps };
