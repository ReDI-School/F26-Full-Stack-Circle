'use client';
import UseAuth from '@/hooks/UseAuth';
import { usePathname, useRouter } from 'next/navigation';

const RequireAuth = ({ children, notice }: { children: React.ReactNode; notice?: string }) => {
  const router = useRouter();
  let pathname = usePathname();
  const { user, loading } = UseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (pathname.split('').filter((segment) => segment === '/').length > 1) {
    pathname = '/';
  }

  if (!user) {
    router.push(
      `/login${pathname ? `?next=${encodeURIComponent(pathname)}&notice=${notice || ''}` : ''}`
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
