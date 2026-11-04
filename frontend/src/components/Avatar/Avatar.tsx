import { avatarStyles } from './Avatar.styles';
import type { AvatarProps } from './Avatar.types';
import { getInitials, colourFor } from './AvatarHelpers';

const Avatar = ({ name, src, size = 'md', colour, className }: AvatarProps) => {
  const initials = getInitials(name);

  return (
    <span className={avatarStyles({ size, colours: colour ?? colourFor(name), className })}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span role="img" aria-label={name}>
          {initials}
        </span>
      )}
    </span>
  );
};

export default Avatar;
