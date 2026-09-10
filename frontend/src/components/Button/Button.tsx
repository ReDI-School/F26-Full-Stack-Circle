import { buttonStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

/**
 * TODO: build the Button.
 *
 * always a pill (rounded-pill), display font weight 800. primary = secondary color bg,
 * secondary = tertiary bg, ghost = 2px tertiary border, danger = secondary-100 bg with
 * danger text, outlineLight = white border for colored backgrounds. Hover darkens ~8%.
 */
const Button = ({ children }: ButtonProps) => {
  return <button className={buttonStyles()}>{children}</button>;
};

export default Button;
