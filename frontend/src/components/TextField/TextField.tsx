import { useId } from 'react';

import { textFieldStyles } from './TextField.styles';
import type { TextFieldProps } from './TextField.types';

const TextField = ({ label, error, id, ...inputProps }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const styles = textFieldStyles({ hasError: Boolean(error) });

  return (
    <div className={styles.root()}>
      <label htmlFor={inputId} className={styles.label()}>
        {label}
      </label>

      <input
        {...inputProps}
        id={inputId}
        className={styles.input()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />

      {error ? (
        <span id={errorId} className={styles.error()}>
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default TextField;