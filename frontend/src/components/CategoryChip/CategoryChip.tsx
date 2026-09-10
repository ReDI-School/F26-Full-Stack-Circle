import { categoryChip } from './CategoryChip.styles';
import type { CategoryChipProps } from './CategoryChip.types';

/**
 * TODO: build the CategoryChip.
 *
 * pill, 14px. Default = white bg, 1.5px border-input, tertiary text. Selected = tertiary
 * bg, white bold text.
 */
const CategoryChip = ({ label }: CategoryChipProps) => {
  return <button className={categoryChip()}>{label}</button>;
};

export default CategoryChip;
