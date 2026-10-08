import React from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outlineLight';

type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The label/icon of the button
   */
  children?: React.ReactNode;

  /**
   * The variant of the button
   */
  variant?: ButtonVariants;

  /**
   * The size of the button
   */

  size?: ButtonSize;

  /**
   * Checking whether the button is stretched
   */
  stretch?: boolean;
}

export type { ButtonProps };
