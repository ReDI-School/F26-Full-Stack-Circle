import { selectStyles } from './Select.styles';
import type { SelectProps } from './Select.types';

/**
 * TODO: build the Select.
 *
 * same look as TextField: radius-input, 1.5px border-input, focus ring in primary-100.
 */
const Select = ({ label }: SelectProps) => {
  return <div className={selectStyles()}>{label}</div>;
};

export default Select;
