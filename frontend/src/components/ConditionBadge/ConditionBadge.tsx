import { useMemo } from 'react';
import { CONDITIONS, SIZES } from './ConditionBadge.constants';
import { conditionBadgeStyles } from './ConditionBadge.styles';
import type { ConditionBadgeProps } from './ConditionBadge.types';

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
