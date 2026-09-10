import { confirmDialog } from './ConfirmDialog.styles';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

/**
 * TODO: build the ConfirmDialog.
 *
 * full-screen overlay rgba(34,52,58,.45) with the dialog centred. Dialog is 380px,
 * white, radius-card, shadow-menu. Buttons bottom-right: ghost then primary.
 */
const ConfirmDialog = ({ title }: ConfirmDialogProps) => {
  return <div className={confirmDialog()}>{title}</div>;
};

export default ConfirmDialog;
