import { emptyStateStyles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

const EmptyState = ({ emoji, title, description, action, variant = 'plain' }: EmptyStateProps) => {
  const styles = emptyStateStyles({ variant });

  return (
    <div className={styles.container()}>
      <div className={styles.emoji()}>{emoji}</div>
      <div className={styles.title()}>{title}</div>
      <div className={styles.description()}>{description}</div>
      <div className={styles.action()}>{action}</div>
    </div>
  );
};

export default EmptyState;
