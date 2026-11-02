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

    let redirectPath = pathname;
    if (redirectPath && redirectPath.split('').filter((segment) => segment === '/').length > 1) {
      redirectPath = '/';
    }

    if (!user) {
      router.replace(
        `/login${redirectPath ? `?next=${encodeURIComponent(redirectPath)}&notice=${notice || ''}` : ''}`
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
