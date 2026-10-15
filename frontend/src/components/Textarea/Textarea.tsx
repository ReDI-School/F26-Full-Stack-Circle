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
  const hasError = Boolean(error?.trim());
  const message = hasError ? error : helperText;
  const messageType = hasError ? 'error' : 'helper';
  const messageId = message ? `${textareaId}-${messageType}` : undefined;

  let descriptionIds = describedBy || undefined;
  if (messageId) {
    descriptionIds = describedBy ? `${describedBy} ${messageId}` : messageId;
  }

  const styles = textareaStyles({ hasError, disabled: textareaProps.disabled });

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
        aria-invalid={hasError ? true : ariaInvalid}
        aria-describedby={descriptionIds}
      />

      <div className={styles.message()}>
        {message ? (
          <span id={messageId} className={hasError ? styles.error() : styles.helper()}>
            {message}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Textarea;
