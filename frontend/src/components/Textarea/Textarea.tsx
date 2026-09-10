import { textarea } from './Textarea.styles';
import type { TextareaProps } from './Textarea.types';

/**
 * TODO: build the Textarea.
 *
 * same look as TextField, vertically resizable.
 */
const Textarea = ({ label }: TextareaProps) => {
  return <div className={textarea()}>{label}</div>;
};

export default Textarea;
