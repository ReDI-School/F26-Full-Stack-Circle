import type { TCondition, TSize } from './ConditionBadge.constants';

interface ConditionBadgeProps {
  /**
   * The condition tier of the item. Determines color scheme and label.
   */
  condition: TCondition;
  /**
   * The size of the badge.
   * - `sm`: Compact size for dense card layouts.
   * - `md`: Standard size for item details and hero cards.
   * @default 'md'
   */
  size?: TSize;
}

export type { ConditionBadgeProps, TCondition, TSize };
