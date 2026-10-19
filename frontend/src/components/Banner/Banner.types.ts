import { ReactNode } from "react";

interface BannerProps {
  /**
   * The headline of the banner
   */
  title: string;

  // TODO: add the rest of the props this component needs:
  subtitle: string;

  variant?: `hero` | `cta`;
  action?: ReactNode;
  
  // - action (button on the right of a cta banner)
}


export type { BannerProps };
