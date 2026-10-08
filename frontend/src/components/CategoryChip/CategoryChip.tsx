import { categoryChipStyles } from './CategoryChip.styles';
import type { CategoryChipProps } from './CategoryChip.types';

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
