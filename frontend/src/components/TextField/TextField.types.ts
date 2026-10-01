import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * The label shown above the field
   */
  label: string;

  /**
   * The error message shown below the field. When set, the input
   * switches to its error style.
   */
  error?: string;
}

export type { TextFieldProps };
