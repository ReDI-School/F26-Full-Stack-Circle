import type { ComponentProps } from 'react';
import { ConditionBadge } from '@/components/ConditionBadge';

export type ItemCondition = ComponentProps<typeof ConditionBadge>['condition'];

export type ItemCardSize = 'sm' | 'md';

interface ItemCardProps {
  // The title of the item.
  title: string;
  // The price of the item in cents.
  priceCents: number;
  // The old price of the item in cents, if applicable.
  oldPriceCents?: number;
  // The condition of the item, which is required for the ConditionBadge component.
  condition: ItemCondition;
  // The category of the item, which is optional.
  category?: string;
  // The seller of the item, which is optional.
  seller?: string;
  // The URL of the image for the item, which is optional.
  imageUrl?: string;
  // Whether the item is sold or not, which is optional.
  sold?: boolean;
  // The size of the item card, which is optional and can be either 'sm' or 'md'.
  size?: ItemCardSize;
  // The onClick handler for the item card, which is optional.
  onClick?: () => void;
}

export type { ItemCardProps };
