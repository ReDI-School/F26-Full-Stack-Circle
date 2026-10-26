import { useId } from 'react';
import { wrapperStyles, labelStyles, selectStyles, errorStyles } from './Select.styles';
import type { SelectProps } from './Select.types';

const Select = ({
  label,
  options,
  error,
  placeholder,
  id,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const hasError = Boolean(error);

  const allDescribedBy = [describedBy, hasError ? errorId : undefined].filter(Boolean).join(' ');

  return (
    <div className={wrapperStyles()}>
      <label htmlFor={selectId} className={labelStyles()}>
        {label}
      </label>
      <select
        id={selectId}
        {...props}
        className={selectStyles({ error: hasError, className })}
        defaultValue={
          props.value === undefined
            ? (props.defaultValue ?? (placeholder && !props.multiple ? '' : undefined))
            : undefined
        }
        aria-invalid={hasError ? true : ariaInvalid}
        aria-describedby={allDescribedBy || undefined}
      >
        {placeholder ? (
          <option value="" disabled className="text-placeholder">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">
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
