type TConditionBadgeProps = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED';
type TSizeProps = 'sm' | 'md';
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
