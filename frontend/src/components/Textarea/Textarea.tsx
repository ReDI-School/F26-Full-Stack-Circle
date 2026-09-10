import { textareaStyles } from './Textarea.styles';
import type { TextareaProps } from './Textarea.types';

/**
 * TODO: build the Textarea.
 *
 * same look as TextField, vertically resizable.
 */
const Textarea = ({ label }: TextareaProps) => {
  return <div className={textareaStyles()}>{label}</div>;
};

export default Textarea;
