import { toast } from './Toast.styles';
import type { ToastProps } from './Toast.types';

/**
 * TODO: build the Toast.
 *
 * dark ink pill, radius 14, white 14px text, with an 8px dot on the left: green for
 * success, secondary for error.
 */
const Toast = ({ message }: ToastProps) => {
  return <div className={toast()}>{message}</div>;
};

export default Toast;
