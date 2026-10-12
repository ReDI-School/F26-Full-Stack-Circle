import { LABELS } from './ConditionBadge.constants';
import { conditionBadgeStyles } from './ConditionBadge.styles';
import type { ConditionBadgeProps } from './ConditionBadge.types';

const ConditionBadge = ({ condition, size = 'md' }: ConditionBadgeProps) => {
  return (
    <span
      className={conditionBadgeStyles({
        variant: condition,
        size: size,
      })}
    >
      {LABELS[condition]}
    </span>
  );
};

export default ConditionBadge;
