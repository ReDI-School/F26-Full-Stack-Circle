import { useMemo } from 'react';
import { CONDITIONS, SIZES } from './ConditionBadge.constants';
import { conditionBadgeStyles } from './ConditionBadge.styles';
import type { ConditionBadgeProps } from './ConditionBadge.types';

/**
 * TODO: build the ConditionBadge.
 *
 * small pill, 13px bold. new = secondary-100/danger text, like-new =
 * primary-100/#2e7d96, good = tertiary-100/tertiary, used = bg/muted with a border.
 */
const getPropByParam = (condition: ConditionBadgeProps['condition']) => {
  return Object.values(CONDITIONS).find((v) => v.param === condition);
};

const getSizeByParam = (size: ConditionBadgeProps['size']) => {
  return Object.values(SIZES).find((v) => v.param === size);
};

const ConditionBadge = ({
  condition = CONDITIONS.new.param,
  size = SIZES.md.param,
}: ConditionBadgeProps) => {
  const prop = useMemo(() => getPropByParam(condition), [condition]);
  const sizeProp = useMemo(() => getSizeByParam(size), [size]);
  return (
    <div
      className={conditionBadgeStyles({
        variant: prop?.variant,
        size: sizeProp?.size,
      })}
    >
      {prop?.label || ''}
    </div>
  );
};

export default ConditionBadge;
