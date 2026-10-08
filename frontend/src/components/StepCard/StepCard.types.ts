interface StepCardBaseProps {
  /**
   * The title of the step
   */
  title: string;
  /**
   * The description of the step
   */
  text: string;
}

interface StepCardNumberProps extends StepCardBaseProps {
  /**
   * The type of marker to display in the circle.
   */
  markerType: 'number';
  /**
   * The number of the step
   */
  step: number;
}

interface StepCardCheckProps extends StepCardBaseProps {
  /**
   * Omit this prop to show a checkmark.
   */
  markerType?: 'check';
}
type StepCardProps = StepCardNumberProps | StepCardCheckProps;

export type { StepCardProps };
