import type { StepCardProps } from './StepCard.types';

/**
 * A card component that displays a step in a process, including a title, description, and a marker (either a number or a checkmark).
 *
 * @param {StepCardProps} props - The props for the StepCard component.
 */
const StepCard = ({
  title = 'Browse & find',
  step = '1',
  text = 'Search or wander the categories. Every item shows its condition, price, and the shop it belongs to.',
  markerType = 'check',
}: StepCardProps) => {
  return (
    <div className="min-w-0 w-full border border-border rounded-card bg-white p-[26px_28px]">
      <div className="flex items-start gap-[18px]">
        <div className="shrink-0 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-tertiary text-white font-display font-black text-[17px]">
          {markerType === 'check' ? '✓' : step}
        </div>

        <div className="min-w-0 flex flex-col gap-1">
          <h3 className="font-display text-[17px] font-extrabold">{title}</h3>

          <div className="text-[14px] color-body leading-relaxed text-body">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
