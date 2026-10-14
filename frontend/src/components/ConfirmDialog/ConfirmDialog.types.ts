interface ConfirmDialogProps {
  /**
   * The question asked at the top of the dialog
   */
  title: string;
  /** Whether the dialog is visible */

  open: boolean;

  /** Additional context for the action */
  description: string;

  /**
   * Label for the confirmation action
   * @default "Confirm"
   */
  confirmLabel?: string;

  /**
   * Label for the cancel action
   * @default "Cancel"
   */
  cancelLabel?: string;

  /** Called when the confirmation action is selected */
  onConfirm: () => void;

  /** Called when the dialog is dismissed */
  onCancel: () => void;
}

export type { ConfirmDialogProps };
