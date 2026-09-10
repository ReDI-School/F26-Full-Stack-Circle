import { shopCardStyles } from './ShopCard.styles';
import type { ShopCardProps } from './ShopCard.types';

/**
 * TODO: build the ShopCard.
 *
 * white card, radius-card, centred column: a large Avatar, the shop name in display 800,
 * then '4 items' in muted 13px.
 */
const ShopCard = ({ name }: ShopCardProps) => {
  return <div className={shopCardStyles()}>{name}</div>;
};

export default ShopCard;
