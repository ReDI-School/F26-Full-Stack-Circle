import { CONDITIONS, SIZES } from './ConditionBadge.constants';

type TypeFrom<T> = T[keyof T];
type TConditionBadgeProps = TypeFrom<typeof CONDITIONS>['param'];
type TSizeProps = TypeFrom<typeof SIZES>['param'];

interface ConditionBadgeProps {
  /**
   * The condition tier of the item. Determines color scheme and label.
   */
  condition: TConditionBadgeProps;
  /**
   * The size of the badge.
   * - `SM`: Compact size for dense card layouts.
   * - `MD`: Standard size for item details and hero cards.
   * @default 'MD'
   */
  size?: TSizeProps;
}

export type { ConditionBadgeProps };
