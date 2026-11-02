'use client';
import { Footer, Layout, Navbar } from '@/components';
import { apiUrl } from '@/config';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
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
      navbar={<Navbar user={user} unreadCount={unreadCount} />}
      footer={<Footer categoryLinks={[]} infoLinks={[]} accountLinks={[]} />}
    >
      {children}
    </Layout>
  );
};

export default AppShell;
