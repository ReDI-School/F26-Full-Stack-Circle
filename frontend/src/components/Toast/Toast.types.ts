interface ToastProps {
  /**
   * The message shown in the toast
   */
  message: string;

  // TODO: add the rest of the props this component needs:
  // - variant: 'success' | 'error' (only changes the colour of the dot)
  variant?: 'success' | 'error';

  onDismiss?: () => void;
}

export type { ToastProps };
