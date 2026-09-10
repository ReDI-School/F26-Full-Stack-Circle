import { textFieldStyles } from './TextField.styles';
import type { TextFieldProps } from './TextField.types';

/**
 * TODO: build the TextField.
 *
 * label in bold 14px, then the input: radius-input, 1.5px border-input, focus = primary
 * border + 3px primary-100 ring, error = secondary border with the message underneath.
 */
const TextField = ({ label }: TextFieldProps) => {
  return <div className={textFieldStyles()}>{label}</div>;
};

export default TextField;
