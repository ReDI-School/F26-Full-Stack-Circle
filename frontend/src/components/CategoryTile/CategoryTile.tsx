import { categoryTileStyles } from './CategoryTile.styles';
import type { CategoryTileProps } from './CategoryTile.types';

/**
 * TODO: build the CategoryTile.
 *
 * pill with a 34px white circle holding the emoji, then the name in display 800.
 * Background cycles the 100-tints. Selected = tertiary bg, white text. Hover lifts 2px.
 */
const CategoryTile = ({
  name,
  emoji,
  tint = 'primary',
  selected = false,
  onClick,
}: CategoryTileProps) => {
  return (
    <button
      type="button"
      className={categoryTileStyles({ tint, selected })}
      aria-pressed={selected}
      onClick={onClick}
    >
      {emoji ? (
        <span className="grid size-[34px] place-items-center rounded-pill bg-white text-lg">
          {emoji}
        </span>
      ) : null}
      <span>{name}</span>
    </button>
  );
};

export default CategoryTile;
