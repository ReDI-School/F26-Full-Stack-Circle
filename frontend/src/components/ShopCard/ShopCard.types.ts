import type { AvatarColour } from '../Avatar';

interface ShopCardProps {
  /** Complete shop name, displayed unchanged. */
  name: string;
  itemCount: number;
  avatarUrl?: string;
  /** Cycle primary, secondary, tertiary across a row. Defaults to primary. */
  avatarColour?: AvatarColour;
  /** Makes the card a keyboard-accessible button when provided. */
  onClick?: () => void;
}

export type { ShopCardProps };
