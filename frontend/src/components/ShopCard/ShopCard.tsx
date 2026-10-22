import { Avatar } from '../Avatar';
import { shopCardStyles } from './ShopCard.styles';
import type { ShopCardProps } from './ShopCard.types';


const ShopCard = ({ name, itemCount, avatarUrl, onClick }: ShopCardProps) => {
  const styles = shopCardStyles();
  const itemText = itemCount === 1 ? 'item' : 'items';
  const shopName = name.split(' ')[0]; 

  return (
    <div className={styles.base()}>
      <Avatar name={name} size="lg" src={avatarUrl} />

      <h2 className={styles.name()}>{shopName}'s shop</h2>

      <p className={styles.itemCount()}>
        {itemCount} {itemText}
      </p>
    </div>
  );
};

export default ShopCard;


