'use client';
import { Footer, Layout, Navbar } from '@/components';
import { apiUrl } from '@/config';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';
import { GearIcon, StorefrontIcon } from '@/lib/icons';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
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

  return (
    <Layout
      navbar={
        <Navbar
          user={user}
          unreadCount={unreadCount}
          menuItems={[
            { type: 'item', icon: StorefrontIcon(), label: 'My shop', onClick: () => {} },
            { type: 'item', icon: GearIcon(), label: 'Account settings', onClick: () => {} },
            { type: 'divider' },
            {
              type: 'item',
              label: 'Log out',
              onClick: () => {
                logout();
              },
            },
          ]}
        />
      }
      footer={<Footer categoryLinks={[]} infoLinks={[]} accountLinks={[]} />}
    >
      {children}
    </Layout>
  );
};

export default AppShell;
