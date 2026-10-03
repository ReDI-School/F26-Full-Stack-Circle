import { avatarStyles } from './Avatar.styles';
import type { AvatarProps } from './Avatar.types';
import {getInitials} from "./AvatarHelpers"
import { colourFor } from './AvatarHelpers';

/**
 * TODO: build the Avatar.
 *
 * pill shape, brand-colored circle, initials centred in the display font. Sizes: sm
 * 32px, md 44px, lg 64px.
 *   return <span className={avatarStyles()}>{name}</span>;
 */
const Avatar = ({ name, src, size = 'md' }: AvatarProps) => {
  const initials = getInitials(name);
  const colour = colourFor(name);

  return (
    <span className={avatarStyles({ size, colours: colour })}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span role="img" aria-label={name}>
          {initials}
        </span>
      )}
    </span>
  );
};

export default Avatar;
