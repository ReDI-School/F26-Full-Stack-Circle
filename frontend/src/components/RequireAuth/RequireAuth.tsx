'use client';
import { useEffect } from 'react';
import UseAuth from '@/hooks/UseAuth';
import { usePathname, useRouter } from 'next/navigation';

const RequireAuth = ({
  children,
  notice,
  needAdminRights = false,
}: {
  children: React.ReactNode;
  notice?: string;
  needAdminRights?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = UseAuth();

  useEffect(() => {
    if (loading) return;

    // Open-redirect guard: only allow same-origin paths (must start with /).
    // Paths like //evil.com start with / but the second / makes them protocol-relative.
    const isSafePath = (path: string) => path.startsWith('/') && !path.startsWith('//');
    const redirectPath = isSafePath(pathname) ? pathname : '/';

    if (!user) {
      router.replace(
        `/login?next=${encodeURIComponent(redirectPath)}&notice=${encodeURIComponent(notice || '')}`
      );
    } else if (needAdminRights && !user.isAdmin) {
      router.replace('/');
    }
  }, [loading, user, needAdminRights, pathname, notice, router]);

  if (loading || !user || (needAdminRights && !user.isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
