import type { ReactNode } from 'react';

type LayoutVariant = 'default' | 'bare';

interface LayoutProps {
  /**
   * The page content
   */
  children: ReactNode;

  /**
   * Rendered at the top, in a sticky header. Passed in, so Layout never
   * imports Navbar itself.
   */
  navbar?: ReactNode;

  /**
   * Rendered at the bottom. Passed in, so Layout never imports Footer itself.
   */
  footer?: ReactNode;

  /**
   * `default`: navbar, content capped at 1140px, footer.
   * `bare`: no navbar or footer, content fills the screen (login, register).
   */
  variant?: LayoutVariant;
}

export type { LayoutProps, LayoutVariant };
