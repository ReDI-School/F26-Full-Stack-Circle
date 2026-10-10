import type { MouseEventHandler } from 'react';

interface CategoryTileProps {
  // category name
  name: string;
  // icon shown inside the white circle
  emoji?: string;
  // The background tint for the tile
  tint?: 'primary' | 'secondary' | 'tertiary';
  // Whether the tile is selected
  selected?: boolean;
  // Called when the tile is clicked
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export type { CategoryTileProps };
