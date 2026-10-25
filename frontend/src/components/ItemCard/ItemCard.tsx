import { ConditionBadge } from '@/components/ConditionBadge';
import { formatPrice } from '@/lib/price';
import { itemCardStyles } from './ItemCard.styles';
import type { ItemCardProps } from './ItemCard.types';
import Image from 'next/image';

const ItemCard = ({
  title,
  priceCents,
  oldPriceCents,
  condition,
  category,
  seller,
  imageUrl,
  sold = false,
  size,
  onClick,
}: ItemCardProps) => {
  const styles = itemCardStyles({ size });

  const hasDiscount = oldPriceCents !== undefined && oldPriceCents > priceCents;

  const meta = size === 'sm' ? seller : [category, seller].filter(Boolean).join(' · ');

  return (
    <button type="button" className={styles.base()} onClick={onClick}>
      <div className={styles.photo()}>
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className={styles.image()} />
        ) : (
          <div className={styles.placeholder()} aria-label="No item photo available">
            item photo
          </div>
        )}

        <div className={styles.condition()}>
          <ConditionBadge condition={condition} />
        </div>

        {sold && <div className={styles.soldOverlay()}>SOLD</div>}
      </div>

      <div className={styles.body()}>
        <span className={styles.title()} title={title}>
          {title}
        </span>

        {meta && <p className={styles.meta()}>{meta}</p>}

        <div className={styles.priceRow()}>
          <span className={styles.price()}>{formatPrice(priceCents)}</span>

          {hasDiscount && <span className={styles.oldPrice()}>{formatPrice(oldPriceCents)}</span>}
        </div>
      </div>
    </button>
  );
};

export default ItemCard;
