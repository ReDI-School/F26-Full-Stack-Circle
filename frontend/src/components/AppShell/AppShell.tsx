'use client';
import { Footer } from '../Footer';
import { Layout } from '../Layout';
import { Navbar } from '../Navbar';
import { ToastProvider } from '../ToastProvider';
import type { AppShellProps } from './AppShell.types';
import { useApi, useAuth } from '@/hooks';
import { useState, useMemo } from 'react';
import { GearIcon, StorefrontIcon, AdminBadge } from '@/lib/icons';
import { useRouter, usePathname } from 'next/navigation';

const AppShell = ({ children }: AppShellProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>('');
  const pathname = usePathname();

  const { data } = useApi<{ unreadCount: number }>('/threads');
  const unreadCount = data?.unreadCount ?? 0;

  const { data: categories } = useApi<{
    categories: {
      id: string;
      slug: string;
      name: string;
      emoji: string;
      tint: number;
      itemCount: number;
    }[];
  }>('/categories');

  const handleSearch = (value: string) => {
    router.push(`/?q=${encodeURIComponent(value)}`);
  };

  const categoryLinks = useMemo(() => {
    if (!categories) return [];
    return categories.categories.map((cat) => ({
      label: cat.name.toLowerCase(),
      href: `/?category=${encodeURIComponent(cat.slug)}`,
    }));
  }, [categories]);

  const infoLinks = useMemo(
    () => [
      { label: 'how to buy', href: '/how-to-buy' },
      { label: 'how to sell', href: '/how-to-sell' },
      { label: 'safety tips', href: '/safety' },
      { label: 'FAQ', href: '/faq' },
    ],
    []
  );

  const accountLinks = useMemo(
    () => [
      { label: 'my shop', href: '/shop' },
      { label: 'account settings', href: '/account' },
      { label: 'sell an item', href: '/items/new' },
    ],
    []
  );

  const myShopItem = {
    type: 'item' as const,
    icon: StorefrontIcon(),
    label: 'My shop',
    onClick: () => {
      router.push('/shop');
    },
  };
  const accountSettingsItem = {
    type: 'item' as const,
    icon: GearIcon(),
    label: 'Account settings',
    onClick: () => {
      router.push('/account');
    },
  };
  const adminItem = {
    type: 'item' as const,
    icon: AdminBadge(),
    label: 'Admin',
    onClick: () => {
      router.push('/admin');
    },
  };
  const logoutItem = {
    type: 'item' as const,
    label: 'Log out',
    onClick: async () => {
      router.replace('/');
      await logout();
    },
  };
  const dividerItem = { type: 'divider' as const };

  const adminMenuItems = [myShopItem, accountSettingsItem, adminItem, dividerItem, logoutItem];
  const userMenuItems = [myShopItem, accountSettingsItem, dividerItem, logoutItem];
  return (
    <ToastProvider>
      <Layout
        variant={pathname === '/login' || pathname === '/register' ? 'bare' : 'default'}
        navbar={
          <Navbar
            user={user}
            unreadCount={unreadCount}
            menuItems={user?.isAdmin ? adminMenuItems : userMenuItems}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={handleSearch}
            onLogin={() => {
              router.push('/login');
            }}
            onRegister={() => {
              router.push('/register');
            }}
          />
        }
        footer={
          <Footer categoryLinks={categoryLinks} infoLinks={infoLinks} accountLinks={accountLinks} />
        }
      >
        {children}
      </Layout>
    </ToastProvider>
  );
};

export default AppShell;
