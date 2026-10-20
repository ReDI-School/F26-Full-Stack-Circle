import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * The label shown above the select
   */
  label: string;

  /**
   * The options are rendered as <option>, 'value' is the enum, 'label' is what people read
   */
  options: { value: string; label: string }[];

  /**
   * The error message shown below the select
   */
  error?: string;

  /**
   * The first option that is meant to act as a placeholder
   */
  placeholder?: string;
}

export type { SelectProps };
