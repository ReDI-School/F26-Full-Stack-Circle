import { CONDITIONS } from './ConditionBadge.constants';

type TypeFrom<T> = T[keyof T];
type EConditionBadgeProps = TypeFrom<typeof CONDITIONS>['param'];
interface ConditionBadgeProps {
  /**
   * The condition of the item
   */
  condition: EConditionBadgeProps;

  // TODO: add the rest of the props this component needs:
  // - type the condition as 'new' | 'like-new' | 'good' | 'used'
  // - a label and colour pair per condition
}

export type { ConditionBadgeProps };
