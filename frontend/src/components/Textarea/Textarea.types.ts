import type { ComponentProps } from 'react';

type TextareaInputProps = Omit<ComponentProps<'textarea'>, 'className'>;

interface TextareaProps extends TextareaInputProps {
  /** The label shown above the textarea. */
  label: string;
  /** Non-blank error messages take precedence over helperText. */
  error?: string;
  /** Additional guidance shown when there is no error. */
  helperText?: string;
}

export type { TextareaProps };
