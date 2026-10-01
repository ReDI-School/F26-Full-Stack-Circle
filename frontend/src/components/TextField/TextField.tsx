import { useId } from 'react';

import { errorStyles, inputStyles, labelStyles, textFieldStyles } from './TextField.styles';
import type { TextFieldProps } from './TextField.types';

const TextField = ({ label, error, id, ...inputProps }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={textFieldStyles()}>
      <label htmlFor={inputId} className={labelStyles()}>
        {label}
      </label>

      <input
        id={inputId}
        className={inputStyles({ hasError: Boolean(error) })}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />

      {error ? (
        <span id={errorId} className={errorStyles()}>
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default TextField;
