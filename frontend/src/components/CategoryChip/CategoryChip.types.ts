interface CategoryChipProps {
  /**
   * The category name shown in the chip
   */
  label: string;

  /**
   * Indication whether the chip is selected.
   */
  selected?: boolean;

  /**
   * Chip event handler when clicked, including deselecting a selected chip.
   */
  onClick?: () => void;
}

export type { CategoryChipProps };
