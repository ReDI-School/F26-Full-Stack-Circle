import { itemCardStyles } from './ItemCard.styles';
import type { ItemCardProps } from './ItemCard.types';

/**
 * TODO: build the ItemCard.
 *
 * white card, radius-card, border. 180px photo area on top with the condition badge at
 * top-left, then title (display 800, 17px), 'category · seller' in muted 13px, and the
 * price in display black 20px secondary. Hover lifts 2px with shadow-card.
 */
const ItemCard = ({ title }: ItemCardProps) => {
  return <div className={itemCardStyles()}>{title}</div>;
};

export default ItemCard;
