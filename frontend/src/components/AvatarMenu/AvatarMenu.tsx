import { avatarMenuStyles } from './AvatarMenu.styles';
import type { AvatarMenuProps } from './AvatarMenu.types';

/**
 * TODO: build the AvatarMenu.
 *
 * white dropdown, radius 16, shadow-menu, 8px padding. Entries are bold 14px tertiary,
 * radius 10, hover bg-bg. 'Log out' uses the danger color.
 */
const AvatarMenu = ({ items }: AvatarMenuProps) => {
  return <div className={avatarMenuStyles()}>{items.join(', ')}</div>;
};

export default AvatarMenu;
