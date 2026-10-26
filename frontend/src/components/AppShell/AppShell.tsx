'use client';

import { Layout } from '../Layout';
import { ToastProvider } from '../ToastProvider';
import type { AppShellProps } from './AppShell.types';

// #47 mounts shared notifications here. Routing/auth/navigation belong to #46.
const AppShell = ({ children }: AppShellProps) => (
  <ToastProvider>
    <Layout>{children}</Layout>
  </ToastProvider>
);

export default AppShell;
