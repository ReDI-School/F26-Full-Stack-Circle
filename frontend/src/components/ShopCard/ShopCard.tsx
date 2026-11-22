'use client';

import { Avatar } from '../Avatar';
import { shopCardStyles } from './ShopCard.styles';
import type { ShopCardProps } from './ShopCard.types';

const ShopCard = ({ name, itemCount, avatarUrl, onClick }: ShopCardProps) => {
  const styles = shopCardStyles({ interactive: Boolean(onClick) });
  const itemLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

  const content = (
    <>
      <span aria-hidden="true" className={styles.avatarWrapper()}>
        <Avatar name={name} src={avatarUrl} size="lg" />
      </span>
      <span className={styles.name()} title={name}>
        {name}
      </span>
      <span className={styles.itemCount()}>{itemLabel}</span>
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
