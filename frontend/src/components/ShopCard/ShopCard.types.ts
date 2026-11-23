interface ShopCardProps {
  /**
   * The name of the shop (displayed unchanged)
   */
  name: string;

  /**
   * Number of items currently listed
   */
  itemCount: number;

  /**
   * Optional shop avatar/profile image URL
   */
  avatarUrl?: string;

  /**
   * Optional click handler; when provided, the card renders as an accessible button
   */
  onClick?: () => void;
}

export type { ShopCardProps };
