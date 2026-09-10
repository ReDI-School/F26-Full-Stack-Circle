import { layoutStyles } from './Layout.styles';
import type { LayoutProps } from './Layout.types';

/**
 * TODO: build the Layout.
 *
 * full-height column, bg-bg. Content is centred with max-width 1140px and horizontal
 * padding.
 */
const Layout = ({ children }: LayoutProps) => {
  return <div className={layoutStyles()}>{children}</div>;
};

export default Layout;
