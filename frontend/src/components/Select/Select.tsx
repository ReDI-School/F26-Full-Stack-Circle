import { useId } from 'react';
import {
  wrapperStyles,
  labelStyles,
  selectStyles,
  errorStyles,
  placeholderStyles,
} from './Select.styles';
import type { SelectProps } from './Select.types';

const Select = ({ label, options, error, placeholder, id, ...props }: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const hasError = Boolean(error);
  return (
    <div className={wrapperStyles()}>
      <label htmlFor={selectId} className={labelStyles()}>
        {label}
      </label>
      <select
        className={selectStyles({ error: hasError })}
        id={selectId}
        {...props}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      >
        {placeholder ? (
          <option className={placeholderStyles()} value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError ? (
        <span className={errorStyles()} id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default Select;
