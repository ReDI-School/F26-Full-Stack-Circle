import { buttonStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  stretch = false,
  ...props
}: ButtonProps) => {
  const classes = buttonStyles({ variant, size, stretch });
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
