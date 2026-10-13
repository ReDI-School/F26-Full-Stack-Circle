'use client';

import { useId } from 'react';

import { textareaStyles } from './Textarea.styles';
import type { TextareaProps } from './Textarea.types';

const Textarea = ({
  label,
  error,
  helperText,
  id,
  rows = 4,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...textareaProps
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const message = error || helperText;
  const messageId = message ? `${textareaId}-${error ? 'error' : 'helper'}` : undefined;
  const descriptionIds = [describedBy, messageId].filter(Boolean).join(' ') || undefined;
  const styles = textareaStyles({ hasError: Boolean(error) });

  return (
    <div className={styles.root()}>
      <label htmlFor={textareaId} className={styles.label()}>
        {label}
      </label>

      <textarea
        {...textareaProps}
        id={textareaId}
        rows={rows}
        className={styles.input()}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={descriptionIds}
      />

      {message ? (
        <span id={messageId} className={error ? styles.error() : styles.helper()}>
          {message}
        </span>
      ) : null}
    </div>
  );
};

export default Textarea;
