import { categoryChipStyles } from './CategoryChip.styles';
import type { CategoryChipProps } from './CategoryChip.types';

/**
 * TODO: build the CategoryChip.
 *
 * pill, 14px. Default = white bg, 1.5px border-input, tertiary text. Selected = tertiary
 * bg, white bold text.
 */
const CategoryChip = ({ label, selected = false, onClick }: CategoryChipProps) => {
  return (
    <button
      type="button"
      className={categoryChipStyles({ selected })}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CategoryChip;
