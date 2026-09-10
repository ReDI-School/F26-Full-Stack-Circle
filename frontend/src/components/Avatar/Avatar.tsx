import { avatar } from './Avatar.styles';
import type { AvatarProps } from './Avatar.types';

/**
 * TODO: build the Avatar.
 *
 * pill shape, brand-colored circle, initials centred in the display font. Sizes: sm
 * 32px, md 44px, lg 64px.
 */
const Avatar = ({ name }: AvatarProps) => {
  return <span className={avatar()}>{name}</span>;
};

export default Avatar;
