import { layoutStyles } from './Layout.styles';
import type { LayoutProps } from './Layout.types';

/**
 * The shell every page renders inside. Navbar and footer are passed in as
 * props, so Layout never imports them and stays trivial to render in Storybook.
 */
const Layout = ({ children, navbar, footer, variant = 'default' }: LayoutProps) => {
  const styles = layoutStyles({ variant });
  const isBare = variant === 'bare';

  return (
    <div className={styles.root()}>
      {/* The slots are rendered as they are, with no wrapper: Navbar brings its
          own sticky <nav> and Footer its own <footer>, so Layout only owns <main> */}
      {isBare ? null : navbar}

      <main className={styles.main()}>
        <div className={styles.content()}>{children}</div>
      </main>

      {isBare ? null : footer}
    </div>
  );
};

export default Layout;
