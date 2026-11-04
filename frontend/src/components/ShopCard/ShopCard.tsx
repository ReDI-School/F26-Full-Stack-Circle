'use client';

import { Avatar } from '../Avatar';
import { shopCardStyles } from './ShopCard.styles';
import type { ShopCardProps } from './ShopCard.types';

const ShopCard = ({
  name,
  itemCount,
  avatarUrl,
  avatarColour = 'bg-primary',
  onClick,
}: ShopCardProps) => {
  const styles = shopCardStyles({ interactive: Boolean(onClick) });
  const content = (
    <>
      <span aria-hidden="true" className="flex shrink-0">
        <Avatar
          name={name}
          src={avatarUrl}
          size="lg"
          colour={avatarColour}
          className="size-14 text-avatar"
        />
      </span>
      <span className={styles.name()} title={name}>
        {name}
      </span>
      <span className={styles.itemCount()}>
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </span>
    </>
  );

  return onClick ? (
    <button type="button" className={styles.base()} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={styles.base()}>{content}</div>
  );
};

export default ShopCard;
