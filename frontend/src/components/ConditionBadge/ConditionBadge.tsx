import { useMemo } from 'react';
import { CONDITIONS } from './ConditionBadge.constants';
import { conditionBadgeStyles } from './ConditionBadge.styles';
import type { ConditionBadgeProps } from './ConditionBadge.types';

/**
 * TODO: build the ConditionBadge.
 *
 * small pill, 13px bold. new = secondary-100/danger text, like-new =
 * primary-100/#2e7d96, good = tertiary-100/tertiary, used = bg/muted with a border.
 */
const getPropByParam = (condition: ConditionBadgeProps['condition']) => {
  const [_, prop] = Object.entries(CONDITIONS).find(([_, v]) => v.param === condition) || [];
  return prop;
};

const ConditionBadge = ({ condition }: ConditionBadgeProps) => {
  const prop = useMemo(() => getPropByParam(condition), [condition]);
  return (
    <span
      className={conditionBadgeStyles({
        variant: prop?.variant,
      })}
    >
      {prop?.label || ''}
    </span>
  );
};

export default ConditionBadge;
