interface StepCardProps {
  /**
   * The title of the step
   */
  title: string;
  /**
   * The number of the step
   */
  step?: string;
  /**
   * The description of the step
   */
  text: string;
  /**
   * The type of marker to display in the circle. Can be either a number or a checkmark.
   */
  markerType?: 'number' | 'check';
}

export type { StepCardProps };
