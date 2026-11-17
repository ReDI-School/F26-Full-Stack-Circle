interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  open: boolean;
  duration?: number;

  onDismiss?: () => void;
}

export type { ToastProps };
