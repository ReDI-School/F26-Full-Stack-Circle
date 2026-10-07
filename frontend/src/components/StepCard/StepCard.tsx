import { stepCardStyles } from './StepCard.styles';
import type { StepCardProps } from './StepCard.types';

/**
 * A card component that displays a step in a process, including a title, description, and a marker (either a number or a checkmark).
 *
 * @param {StepCardProps} props - The props for the StepCard component.
 */
const StepCard = (props: StepCardProps) => {
  const { title, text } = props;
  const styles = stepCardStyles();

  return (
    <div className={styles.base()}>
      <div className={styles.row()}>
        <div className={styles.marker()}>{props.markerType === 'number' ? props.step : '✓'}</div>

        <div className={styles.content()}>
          <h3 className={styles.title()}>{title}</h3>

          <div className={styles.text()}>{text}</div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
