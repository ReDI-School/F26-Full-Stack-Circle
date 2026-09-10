import { stepCard } from './StepCard.styles';
import type { StepCardProps } from './StepCard.types';

/**
 * TODO: build the StepCard.
 *
 * white card, radius-card, row: a 40px tertiary circle with the step number, then the
 * title and description.
 */
const StepCard = ({ title }: StepCardProps) => {
  return <div className={stepCard()}>{title}</div>;
};

export default StepCard;
