import type { AvatarMenuEntry } from '../AvatarMenu';

interface NavbarUser {
  /**
   * The signed-in user's name, used for the avatar initials and its label
   */
  name: string;

  /**
   * Optional profile picture
   */
  avatarUrl?: string;
}

/**
 * The Navbar is "dumb": it takes data and callbacks and knows nothing about
 * routing or auth. The page decides what each callback does.
 */
interface NavbarProps {
  /**
   * The signed-in user. `null` or left out means a guest.
   */
  user?: NavbarUser | null;

  /**
   * Unread messages, shown as a badge on the inbox. Hidden when 0; above 99 shows "99+".
   */
  unreadCount?: number;

  /**
   * The current search text. Pass it with `onSearchChange` to control the field.
   */
  searchValue?: string;

  /**
   * Called on every keystroke in the search field
   */
  onSearchChange?: (value: string) => void;

  /**
   * Called with the search text when the search is submitted: Enter on a
   * keyboard, or the "Search"/"Go" key on a phone keyboard
   */
  onSearch?: (value: string) => void;

  /**
   * Called when the logo is clicked (usually: go home)
   */
  onLogoClick?: () => void;

  /**
   * Called by "+ Add item" (logged in)
   */
  onAddItem?: () => void;

  /**
   * Called by the inbox button (logged in)
   */
  onInbox?: () => void;

  /**
   * Called by "Log in" (guest)
   */
  onLogin?: () => void;

  /**
   * Called by "Start selling" (guest)
   */
  onRegister?: () => void;

  /**
   * The avatar dropdown entries, passed straight to AvatarMenu
   */
  menuItems?: AvatarMenuEntry[];
}

export type { NavbarProps, NavbarUser };
