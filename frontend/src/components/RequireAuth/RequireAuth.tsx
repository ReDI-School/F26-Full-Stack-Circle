'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks';
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
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // usePathname() only ever returns the pathname portion, never a full URL,
    // so it is always a safe value to put in ?next=.
    if (!user) {
      const params = new URLSearchParams({ next: pathname });
      if (notice) params.set('notice', notice);
      router.replace(`/login?${params}`);
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
