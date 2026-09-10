import { categoryTile } from './CategoryTile.styles';
import type { CategoryTileProps } from './CategoryTile.types';

/**
 * TODO: build the CategoryTile.
 *
 * pill with a 34px white circle holding the emoji, then the name in display 800.
 * Background cycles the 100-tints. Selected = tertiary bg, white text. Hover lifts 2px.
 */
const CategoryTile = ({ name }: CategoryTileProps) => {
  return <button className={categoryTile()}>{name}</button>;
};

export default CategoryTile;
