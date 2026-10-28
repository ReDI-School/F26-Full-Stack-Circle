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
      {!isBare && navbar ? <header className={styles.header()}>{navbar}</header> : null}

      <main className={styles.main()}>
        <div className={styles.content()}>{children}</div>
      </main>

      {/* A div, not <footer>: the Footer component renders its own <footer>,
          and HTML does not allow a <footer> inside another <footer> */}
      {!isBare && footer ? <div>{footer}</div> : null}
    </div>
  );
};

export default Layout;
