'use client';
import { Footer, Layout, Navbar } from '@/components';
import { apiUrl } from '@/config';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';
import { GearIcon, StorefrontIcon, AdminBadge } from '@/lib/icons';
import { useRouter } from 'next/navigation';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  useEffect(() => {
    const unreadCount = async () => {
      try {
        const response = await fetch(apiUrl('/threads'), {
          credentials: 'include',
        });
        const data = await response.json();
        setUnreadCount(data.unreadCount);
        return;
      } catch (error) {
        console.error(error);
      }
    };
    unreadCount();
  }, []);
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
    <Layout
      navbar={
        <Navbar
          user={user}
          unreadCount={unreadCount}
          menuItems={user?.isAdmin ? adminMenuItems : userMenuItems}
        />
      }
      // TODO: fill in the footer with the correct links, once we have them
      footer={<Footer categoryLinks={[]} infoLinks={[]} accountLinks={[]} />}
    >
      {children}
    </Layout>
  );
};

export default AppShell;
