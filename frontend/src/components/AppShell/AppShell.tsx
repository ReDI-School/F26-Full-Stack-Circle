'use client';
import { Footer, Layout, Navbar } from '@/components';
import { ToastProvider } from '../ToastProvider';
import type { AppShellProps } from './AppShell.types';
import { useApi, useAuth } from '@/hooks';
import { useState } from 'react';
import { GearIcon, StorefrontIcon, AdminBadge } from '@/lib/icons';
import { useRouter, usePathname } from 'next/navigation';

const AppShell = ({ children }: AppShellProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>('');
  const pathname = usePathname();

  const { data } = useApi<{ unreadCount: number }>('/threads');
  const unreadCount = data?.unreadCount ?? 0;
  const handleSearch = () => {
    router.push(`/?q=${searchValue}`);
  };
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
    onClick: () => {
      logout();
      router.push('/login');
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
          />
        }
        // TODO: fill in the footer with the correct links, once we have them
        footer={<Footer categoryLinks={[]} infoLinks={[]} accountLinks={[]} />}
      >
        {children}
      </Layout>
    </ToastProvider>
  );
};

export default AppShell;
