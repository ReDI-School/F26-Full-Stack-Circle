import { ReactNode } from 'react';

interface BannerProps {
  /**
   * The headline of the banner
   */
  title: string;

  // TODO: add the rest of the props this component needs:
  description: string;

  variant: 'hero' | 'cta';
  // it is reactnode because i want to pass Button jsx to the component
  // reactnode is a type that reatc can render
  action?: ReactNode;

  // - action (button on the right of a cta banner)
}

export type { BannerProps };
