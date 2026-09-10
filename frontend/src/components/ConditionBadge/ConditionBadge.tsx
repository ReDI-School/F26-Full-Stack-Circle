import { conditionBadgeStyles } from './ConditionBadge.styles';
import type { ConditionBadgeProps } from './ConditionBadge.types';

/**
 * TODO: build the ConditionBadge.
 *
 * small pill, 13px bold. new = secondary-100/danger text, like-new =
 * primary-100/#2e7d96, good = tertiary-100/tertiary, used = bg/muted with a border.
 */
const ConditionBadge = ({ condition }: ConditionBadgeProps) => {
  return <span className={conditionBadgeStyles()}>{condition}</span>;
};

export default ConditionBadge;
