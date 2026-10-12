import type { ComponentProps } from 'react';

type TextFieldInputProps = Omit<ComponentProps<'input'>, 'className'>;

interface TextFieldProps extends TextFieldInputProps {
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
