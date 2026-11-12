import type { ReactNode } from 'react';

export interface RequireAuthProps {
  children: ReactNode;
  notice?: string;
  needAdminRights?: boolean;
}
