import { navbar } from './Navbar.styles';
import type { NavbarProps } from './Navbar.types';

/**
 * TODO: build the Navbar.
 *
 * sticky white bar, border-bottom, shadow-nav. Content max-width 1076px: logo, search
 * pill, then right-aligned '+ Add item', inbox icon with a count bubble, and the avatar.
 */
const Navbar = ({ userName }: NavbarProps) => {
  return <nav className={navbar()}>{userName}</nav>;
};

export default Navbar;
