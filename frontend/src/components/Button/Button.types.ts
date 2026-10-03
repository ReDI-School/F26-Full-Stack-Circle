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

  // TODO: add the rest of the props this component needs:
  // - variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outlineLight'
  // - size: 'md' | 'sm'
  // - stretch
  // - disabled
}

export type { ButtonProps };
